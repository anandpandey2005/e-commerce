import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import z from 'zod';
import { Admin_User } from '../../../models/user.js';
import { generate_tokens, set_token_cookies } from '../../../utils/token.js';

const admin_sign_in_schema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function sign_in(req: Request, res: Response): Promise<void> {
  try {
    const parse_result = admin_sign_in_schema.safeParse(req.body);
    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parse_result.data;

    const admin_user = await Admin_User.findOne({
      email,
      role: { $in: ['admin', 'owner'] },
      is_deleted: false,
    });

    if (!admin_user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or non-admin account.',
      });
      return;
    }

    const is_password_valid = await bcrypt.compare(password, admin_user.password);
    if (!is_password_valid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const { access_token, refresh_token } = generate_tokens(
      admin_user._id,
      admin_user.role
    );

    admin_user.refresh_token = refresh_token;
    await admin_user.save();

    set_token_cookies(res, access_token, refresh_token);

    res.status(200).json({
      success: true,
      message: 'Admin signed in successfully.',
      data: {
        admin: {
          _id: admin_user._id,
          full_name: admin_user.full_name,
          email: admin_user.email,
          role: admin_user.role,
        },
        access_token,
        refresh_token,
      },
    });
    return;
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
