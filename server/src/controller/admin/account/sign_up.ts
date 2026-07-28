import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import z from 'zod';
import { User } from '../../../models/user.js';
import { generate_tokens, set_token_cookies } from '../../../utils/token.js';

const admin_sign_up_schema = z.object({
  full_name: z.string().trim().min(2).max(50),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(12),
  phone: z
    .object({
      country_code: z.string().default('+91'),
      number: z.string()
    })

});

export async function sign_up(req: Request, res: Response): Promise<void> {
  try {
    // 1. Single-Admin Constraint: Check if an Admin account already exists
    const existing_admin = await User.findOne({
      role: { $in: ['admin', 'owner'] },
      is_deleted: false,
    });

    if (existing_admin) {
      res.status(400).json({
        success: false,
        message: 'Admin account already exists. Only 1 Admin account is permitted in the system.',
      });
      return;
    }

    const parse_result = admin_sign_up_schema.safeParse(req.body || {});
    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { full_name, email, password, phone } = parse_result.data;

    // Check if email already registered under user role
    const existing_user = await User.findOne({ email, is_deleted: false });
    if (existing_user) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const admin_user = new User({
      full_name,
      email,
      password: hashed_password,
      phone,
      role: 'admin',
      is_email_verified: true,
      is_phone_verified: true,
    });

    await admin_user.save();

    const { access_token, refresh_token } = generate_tokens(
      admin_user._id,
      admin_user.role
    );

    admin_user.refresh_token = refresh_token;
    await admin_user.save();

    set_token_cookies(res, access_token, refresh_token);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
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
