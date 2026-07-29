import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { User_User, Admin_User } from '../../../models/user.js';
import { refresh_token_schema } from '../../../validations/user.js';
import { generate_tokens, set_token_cookies } from '../../../utils/token.js';

export async function refresh_token(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const zod_result = refresh_token_schema.safeParse(req.body || {});

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    let input_refresh_token: string | undefined = zod_result.data.refresh_token;

    if (!input_refresh_token && req.cookies && req.cookies.refresh_token) {
      input_refresh_token = req.cookies.refresh_token;
    } else if (!input_refresh_token && req.headers['x-refresh-token']) {
      input_refresh_token = req.headers['x-refresh-token'] as string;
    } else if (
      !input_refresh_token &&
      req.headers.authorization?.startsWith('Bearer ')
    ) {
      input_refresh_token = req.headers.authorization.split(' ')[1];
    }

    if (!input_refresh_token) {
      res.status(401).json({
        success: false,
        message: 'Refresh token is required.',
      });
      return;
    }

    const refresh_secret =
      process.env.JWT_REFRESH_SECRET ||
      process.env.JWT_SECRET ||
      'default_jwt_refresh_secret_key';

    let decoded: { id: string; role?: string };
    try {
      decoded = jwt.verify(input_refresh_token, refresh_secret) as {
        id: string;
        role?: string;
      };
    } catch {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token. Please sign in again.',
      });
      return;
    }

    let user = null;
    const is_admin_role =
      decoded.role === 'admin' ||
      decoded.role === 'owner' ||
      decoded.role === 'employee' ||
      decoded.role === 'support';

    if (is_admin_role) {
      user = await Admin_User.findOne({ _id: decoded.id, is_deleted: false });
    }
    if (!user) {
      user = await User_User.findOne({ _id: decoded.id, is_deleted: false });
    }
    if (!user && !is_admin_role) {
      user = await Admin_User.findOne({ _id: decoded.id, is_deleted: false });
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User account not found or has been deleted.',
      });
      return;
    }

    if (!user.refresh_token || user.refresh_token !== input_refresh_token) {
      res.status(401).json({
        success: false,
        message: 'Session invalidated. You have logged in on another device.',
      });
      return;
    }

    const tokens = generate_tokens(user._id, user.role);

    user.refresh_token = tokens.refresh_token;
    await user.save();

    set_token_cookies(res, tokens.access_token, tokens.refresh_token);

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully.',
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
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
