import { Router } from 'express';
import { toggle_status } from '../controller/common/toggle_status.js';
import { delete_records } from '../controller/common/delete_records.js';

const router = Router();

// Generic dynamic status toggle (supports product, category, user, story, etc.)
router.patch('/toggle-status', toggle_status);

// Generic single & bulk delete endpoint
router.delete('/delete-records', delete_records);

export default router;
