import { Response } from 'express';
import { Request } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import {
  logout_otp_request_schema,
  logout_otp_verify_schema,
} from '../../../validations/user.js';
import { clear_token_cookies } from '../../../utils/token.js';

export async function logout(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (req.user) {
      const user = await User.findOne({
        _id: req.user._id,
        is_deleted: false,
      });

      if (user) {
        user.refresh_token = undefined;
        await user.save();
      }
    }

    clear_token_cookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
    return;
  } catch (err: unknown) {
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

export async function request_logout_otp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const zod_result = logout_otp_request_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, phone } = zod_result.data;

    const query: Record<string, unknown>[] = [];
    if (email) query.push({ email });
    if (phone) query.push({ 'phone.number': phone.number });

    const user = await User.findOne({
      is_deleted: false,
      $or: query,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    const generated_otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = generated_otp;
    user.otp_expiry = otp_expiry;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logout OTP sent successfully.',
      data: {
        otp_sent: true,
        ...(process.env.NODE_ENV !== 'production' && {
          dev_otp: generated_otp,
        }),
      },
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

export async function verify_logout_otp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const zod_result = logout_otp_verify_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, phone, otp } = zod_result.data;

    const query: Record<string, unknown>[] = [];
    if (email) query.push({ email });
    if (phone) query.push({ 'phone.number': phone.number });

    const user = await User.findOne({
      is_deleted: false,
      $or: query,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    if (!user.otp || user.otp !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP code.',
      });
      return;
    }

    if (!user.otp_expiry || user.otp_expiry < new Date()) {
      res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
      return;
    }

    user.refresh_token = undefined;
    user.otp = undefined;
    user.otp_expiry = undefined;

    await user.save();

    clear_token_cookies(res);

    res.status(200).json({
      success: true,
      message: 'Verified OTP. Account logged out from all active sessions.',
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
