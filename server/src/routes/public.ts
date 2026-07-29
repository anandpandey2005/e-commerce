import { Router } from 'express';
import { get_categories, get_products } from '../controller/admin/inventory_manage/get_inventory.js';


const router = Router();

router.get('/products', get_products);
router.get('/categories', get_categories);

export default router;
