import { Router } from 'express';
import { authenticate_user } from '../middleware/auth.js';
import { sign_up } from '../controller/user/account/sign_up.js';
import { sign_in } from '../controller/user/account/sign_in.js';
import { refresh_token } from '../controller/user/account/refresh_token.js';
import {
  logout,
  request_logout_otp,
  verify_logout_otp,
} from '../controller/user/account/logout.js';
import { retrieve_account } from '../controller/user/account/retrieve_account.js';
import { update_name } from '../controller/user/account/update_name.js';
import { update_email } from '../controller/user/account/update_email.js';
import { update_phone } from '../controller/user/account/update_phone.js';
import { add_address } from '../controller/user/account/add_address.js';
import { update_address } from '../controller/user/account/update_address.js';
import { delete_address } from '../controller/user/account/delete_address.js';
import { delete_account } from '../controller/user/account/delete_account.js';
import { get_settings } from '../controller/user/account/get_settings.js';
import { update_settings } from '../controller/user/account/update_settings.js';

const router = Router();

// Public authentication
router.post('/signup', sign_up);
router.post('/signin', sign_in);
router.post('/refresh-token', refresh_token);
router.post('/logout-otp/request', request_logout_otp);
router.post('/logout-otp/verify', verify_logout_otp);

// Authenticated user account 
router.post('/logout', authenticate_user, logout);
router.get('/me', authenticate_user, retrieve_account);
router.patch('/name', authenticate_user, update_name);
router.patch('/email', authenticate_user, update_email);
router.patch('/phone', authenticate_user, update_phone);

// User settings 
router.get('/settings', authenticate_user, get_settings);
router.patch('/settings', authenticate_user, update_settings);

// Address management
router.post('/address/add', authenticate_user, add_address);
router.patch('/address/update', authenticate_user, update_address);
router.delete('/address/delete', authenticate_user, delete_address);

// Soft delete account 
router.delete('/delete', authenticate_user, delete_account);

export default router;
