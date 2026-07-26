import { Request, Response } from 'express';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import { User } from '../../../models/user.js';
import { sign_up_schema } from '../../../validations/user.js';
import { generate_tokens, set_token_cookies } from '../../../utils/token.js';

export async function sign_up(req: Request, res: Response): Promise<void> {
  try {
    const zod_result = sign_up_schema.safeParse(req?.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { full_name, email, password, phone } = zod_result.data;

    const existing_user = await User.findOne({
      is_deleted: false,
      $or: [{ email }, { 'phone.number': phone.number }],
    });

    if (existing_user) {
      res.status(400).json({
        success: false,
        message:
          existing_user.email === email
            ? 'An active account with this email already exists.'
            : 'An active account with this phone number already exists.',
      });
      return;
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const new_user = new User({
      full_name,
      email,
      password: hashed_password,
      phone,
      is_deleted: false,
    });

    const { access_token, refresh_token } = generate_tokens(
      new_user._id,
      new_user.role
    );

    new_user.refresh_token = refresh_token;
    await new_user.save();

    set_token_cookies(res, access_token, refresh_token);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        access_token,
        refresh_token,
        user: {
          id: new_user._id,
          full_name: new_user.full_name,
          email: new_user.email,
          phone: new_user.phone,
          role: new_user.role,
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
