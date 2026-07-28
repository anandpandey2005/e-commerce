import { Request, Response } from 'express';
import { Product } from '../../../models/product.js';
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

    const products = await Product.find({}).populate('category_id', 'name slug').lean();

    const formatted_items = products.map((item: any) => ({
      ID: item._id.toString(),
      SKU: item.sku,
      Name: item.name,
      Slug: item.slug,
      Brand: item.brand,
      Category: item.category_id?.name || 'Uncategorized',
      Category_Slug: item.category_id?.slug || 'uncategorized',
      Original_Price: item.original_price,
      Current_Price: item.current_price,
      Discount_Percentage: item.discount_percentage,
      Stock: item.stock,
      Stock_Status: item.stock_availabilty_flag,
      Is_In_Stock: item.is_in_stock,
      Is_Featured: item.is_it_featured,
      Is_Active: item.is_active,
      Thumbnail: item.thumbnail,
      Created_At: item.createdAt ? new Date(item.createdAt).toISOString() : '',
    }));

    if (requested_format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.json"');
      res.status(200).json({
        success: true,
        message: 'Inventory exported successfully.',
        total_items: formatted_items.length,
        data: formatted_items,
      });
      return;
    }

    if (requested_format === 'csv') {
      if (formatted_items.length === 0) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.csv"');
        res.status(200).send('ID,SKU,Name,Brand,Category,Current_Price,Stock\n');
        return;
      }

      const headers = Object.keys(formatted_items[0]).join(',');
      const rows = formatted_items.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      );

      const csv_content = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.csv"');
      res.status(200).send(csv_content);
      return;
    }

    if (requested_format === 'excel') {
      // Create XML-based Excel Spreadsheet string format
      if (formatted_items.length === 0) {
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.xls"');
        res.status(200).send('');
        return;
      }

      const headers = Object.keys(formatted_items[0]);
      let excel_xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:o="urn:schemas-microsoft-com:office:office"\n xmlns:x="urn:schemas-microsoft-com:office:excel"\n xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n <Worksheet ss:Name="Inventory">\n  <Table>\n   <Row>\n`;

      headers.forEach((h) => {
        excel_xml += `    <Cell><Data ss:Type="String">${h}</Data></Cell>\n`;
      });
      excel_xml += `   </Row>\n`;

      formatted_items.forEach((row) => {
        excel_xml += `   <Row>\n`;
        headers.forEach((h) => {
          const val = (row as any)[h];
          const type = typeof val === 'number' ? 'Number' : 'String';
          excel_xml += `    <Cell><Data ss:Type="${type}">${String(val ?? '')}</Data></Cell>\n`;
        });
        excel_xml += `   </Row>\n`;
      });

      excel_xml += `  </Table>\n </Worksheet>\n</Workbook>`;

      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_export.xls"');
      res.status(200).send(excel_xml);
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
