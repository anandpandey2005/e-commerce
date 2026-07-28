import { Router } from 'express';
import { authenticate_user } from '../middleware/auth.js';
import { is_admin } from '../middleware/is_admin.js';
import { toggle_status } from '../controller/common/toggle_status.js';
import { delete_records } from '../controller/common/delete_records.js';
import { delete_product } from '../controller/admin/inventory_manage/delete_product.js';
import { delete_category } from '../controller/admin/inventory_manage/delete_category.js';

const router = Router();

// Protect all admin routes with authentication and admin role verification
router.use(authenticate_user, is_admin);

// Inventory Status Toggling (uses common toggle_status controller directly)
router.patch('/inventory/toggle-status', toggle_status);

// Deletion Operations (uses common delete_records controller directly & specific handlers)
router.delete('/inventory/delete-records', delete_records);
router.delete('/inventory/product/delete', delete_product);
router.delete('/inventory/category/delete', delete_category);

export default router;
