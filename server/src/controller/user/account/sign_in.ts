import { Request, Response } from 'express';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import { User } from '../../../models/user.js';
import { sign_in_schema } from '../../../validations/user.js';
import { generate_tokens, set_token_cookies } from '../../../utils/token.js';

export async function sign_in(req: Request, res: Response): Promise<void> {
  try {
    const zod_result = sign_in_schema.safeParse(req?.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, phone, password } = zod_result.data;

    const query: Record<string, unknown>[] = [];
    if (email) {
      query.push({ email });
    }
    if (phone) {
      query.push({ 'phone.number': phone.number });
    }

    const user = await User.findOne({
      is_deleted: false,
      $or: query,
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or account does not exist.',
      });
      return;
    }

    const is_match = await bcrypt.compare(password, user.password);
    if (!is_match) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
      return;
    }

    const { access_token, refresh_token } = generate_tokens(
      user._id,
      user.role
    );
    user.refresh_token = refresh_token;
    await user.save();

    set_token_cookies(res, access_token, refresh_token);

    res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      data: {
        access_token,
        refresh_token,
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          saved_address: user.saved_address,
          settings: user.settings,
        },
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
