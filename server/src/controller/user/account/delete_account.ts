import { Response } from 'express';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { delete_account_schema } from '../../../validations/user.js';

export async function delete_account(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const zod_result = delete_account_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { password } = zod_result.data;

    const user = await User.findOne({
      _id: req.user._id,
      is_deleted: false,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found or already deleted.',
      });
      return;
    }

    if (password) {
      const is_match = await bcrypt.compare(password, user.password);
      if (!is_match) {
        res.status(401).json({
          success: false,
          message: 'Invalid password. Cannot confirm account deletion.',
        });
        return;
      }
    }

    //soft delete
    user.is_deleted = true;
    user.deleted_at = new Date();
    user.refresh_token = undefined;
    user.otp = undefined;
    user.otp_expiry = undefined;
    user.email_otp = undefined;
    user.email_otp_expiry = undefined;
    user.phone_otp = undefined;
    user.phone_otp_expiry = undefined;
    user.pending_email = undefined;
    user.pending_phone = undefined;

    await user.save();

    res.clearCookie('access_token');

    res.status(200).json({
      success: true,
      message:
        'Account deleted successfully. You may create a new account anytime with your phone number or email.',
    });
    return;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: err.flatten().fieldErrors,
      });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message || 'An unexpected system error occurred.',
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
