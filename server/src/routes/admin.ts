import { Router } from 'express';
import { authenticate_user } from '../middleware/auth.js';
import { is_admin } from '../middleware/is_admin.js';
import { upload_by_admin } from '../middleware/upload.js';

// Admin Account Controllers
import { sign_up } from '../controller/admin/account/sign_up.js';
import { sign_in } from '../controller/admin/account/sign_in.js';
import { logout } from '../controller/admin/account/logout.js';
import { retrieve_account } from '../controller/admin/account/retrieve_account.js';

// Inventory Management Controllers
import { add_category } from '../controller/admin/inventory_manage/add_category.js';
import { update_category } from '../controller/admin/inventory_manage/update_category.js';
import { delete_category } from '../controller/admin/inventory_manage/delete_category.js';
import { add_product } from '../controller/admin/inventory_manage/add_product.js';
import { update_product } from '../controller/admin/inventory_manage/update_product.js';
import { delete_product } from '../controller/admin/inventory_manage/delete_product.js';
import { bulk_import } from '../controller/admin/inventory_manage/bulk_import.js';
import { export_inventory } from '../controller/admin/inventory_manage/export_inventory.js';
import { toggle_active } from '../controller/admin/inventory_manage/toggle_active_status.js';
import { toggle_status } from '../controller/common/toggle_status.js';
import { delete_records } from '../controller/common/delete_records.js';

const router = Router();

// Public Admin Authentication Routes
router.post('/account/signup', sign_up);
router.post('/account/signin', sign_in);

// Protected Admin Account Routes
router.post('/account/logout', authenticate_user, is_admin, logout);
router.get('/account/me', authenticate_user, is_admin, retrieve_account);

// Protected Inventory Management Routes
router.post(
  '/inventory/category/add',
  authenticate_user,
  is_admin,
  upload_by_admin.any(),
  add_category
);

router.patch(
  '/inventory/category/update',
  authenticate_user,
  is_admin,
  upload_by_admin.any(),
  update_category
);

router.delete(
  '/inventory/category/delete',
  authenticate_user,
  is_admin,
  delete_category
);

router.post(
  '/inventory/product/add',
  authenticate_user,
  is_admin,
  upload_by_admin.any(),
  add_product
);

router.patch(
  '/inventory/product/update',
  authenticate_user,
  is_admin,
  upload_by_admin.any(),
  update_product
);

router.delete(
  '/inventory/product/delete',
  authenticate_user,
  is_admin,
  delete_product
);

router.post(
  '/inventory/bulk-import',
  authenticate_user,
  is_admin,
  upload_by_admin.single('file'),
  bulk_import
);

router.get(
  '/inventory/export',
  authenticate_user,
  is_admin,
  export_inventory
);

router.patch(
  '/inventory/toggle-status',
  authenticate_user,
  is_admin,
  toggle_active
);

router.delete(
  '/inventory/delete-records',
  authenticate_user,
  is_admin,
  delete_records
);

export default router;
