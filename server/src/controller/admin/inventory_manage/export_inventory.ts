import { Request, Response } from 'express';
import { Admin_Product } from '../../../models/product.js';
import { export_inventory_schema } from '../../../validations/catalog.js';

export async function export_inventory(req: Request, res: Response): Promise<void> {
  try {
    const format = (req.query.format as string) || (req.body && req.body.format) || 'json';
    const parse_result = export_inventory_schema.safeParse({ format: format.toLowerCase() });

    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed. Format must be json, csv, or excel.',
      });
      return;
    }

    const requested_format = parse_result.data.format;

    const cursor = Admin_Product.find({})
      .populate('category_id', 'name slug')
      .lean()
      .cursor();

    const format_item = (item: any) => ({
      ID: item._id ? item._id.toString() : '',
      SKU: item.sku || '',
      Name: item.name || '',
      Slug: item.slug || '',
      Brand: item.brand || '',
      Category: item.category_id?.name || 'Uncategorized',
      Category_Slug: item.category_id?.slug || 'uncategorized',
      Original_Price: item.original_price ?? 0,
      Current_Price: item.current_price ?? 0,
      Discount_Percentage: item.discount_percentage ?? 0,
      Stock: item.stock ?? 0,
      Stock_Status: item.stock_availabilty_flag || '',
      Is_In_Stock: item.is_in_stock ? 'Yes' : 'No',
      Is_Featured: item.is_it_featured ? 'Yes' : 'No',
      Is_Active: item.is_active ? 'Yes' : 'No',
      Thumbnail: item.thumbnail || '',
      Created_At: item.createdAt ? new Date(item.createdAt).toISOString() : '',
    });

    if (requested_format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.json"');
      res.write('[');

      let is_first = true;
      for (let item = await cursor.next(); item != null; item = await cursor.next()) {
        const formatted = format_item(item);
        if (!is_first) res.write(',');
        res.write(JSON.stringify(formatted));
        is_first = false;
      }

      res.write(']');
      res.end();
      return;
    }

    if (requested_format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.csv"');

      const headers = [
        'ID', 'SKU', 'Name', 'Slug', 'Brand', 'Category', 'Category_Slug',
        'Original_Price', 'Current_Price', 'Discount_Percentage', 'Stock',
        'Stock_Status', 'Is_In_Stock', 'Is_Featured', 'Is_Active', 'Thumbnail', 'Created_At'
      ];
      res.write(headers.join(',') + '\n');

      for (let item = await cursor.next(); item != null; item = await cursor.next()) {
        const row = format_item(item);
        const csv_row = Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',');
        res.write(csv_row + '\n');
      }

      res.end();
      return;
    }

    if (requested_format === 'excel') {
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.xls"');

      const headers = [
        'ID', 'SKU', 'Name', 'Slug', 'Brand', 'Category', 'Category_Slug',
        'Original_Price', 'Current_Price', 'Discount_Percentage', 'Stock',
        'Stock_Status', 'Is_In_Stock', 'Is_Featured', 'Is_Active', 'Thumbnail', 'Created_At'
      ];

      res.write(`<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:o="urn:schemas-microsoft-com:office:office"\n xmlns:x="urn:schemas-microsoft-com:office:excel"\n xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n <Worksheet ss:Name="Inventory">\n  <Table>\n   <Row>\n`);

      headers.forEach((h) => {
        res.write(`    <Cell><Data ss:Type="String">${h}</Data></Cell>\n`);
      });
      res.write(`   </Row>\n`);

      for (let item = await cursor.next(); item != null; item = await cursor.next()) {
        const row = format_item(item);
        res.write(`   <Row>\n`);
        headers.forEach((h) => {
          const val = (row as any)[h];
          const type = typeof val === 'number' ? 'Number' : 'String';
          res.write(`    <Cell><Data ss:Type="${type}">${String(val ?? '')}</Data></Cell>\n`);
        });
        res.write(`   </Row>\n`);
      }

      res.write(`  </Table>\n </Worksheet>\n</Workbook>`);
      res.end();
      return;
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || 'An unexpected system error occurred.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'An unexpected system error occurred.',
    });
    return;
  }
}
