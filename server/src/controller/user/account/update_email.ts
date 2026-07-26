import { Response } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { update_email_schema } from '../../../validations/user.js';

export async function update_email(
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

    const zod_result = update_email_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { new_email, otp } = zod_result.data;

    const user = await User.findOne({
      _id: req.user._id,
      is_deleted: false,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    if (user.email === new_email) {
      res.status(400).json({
        success: false,
        message:
          'New email address must be different from current email address.',
      });
      return;
    }

    if (!otp) {
      const existing_user = await User.findOne({
        email: new_email,
        is_deleted: false,
        _id: { $ne: user._id },
      });

      if (existing_user) {
        res.status(400).json({
          success: false,
          message: 'An active account with this email address already exists.',
        });
        return;
      }

      const generated_otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.pending_email = new_email;
      user.email_otp = generated_otp;
      user.email_otp_expiry = otp_expiry;

      await user.save();

      res.status(200).json({
        success: true,
        message: `OTP sent to ${new_email}. Please provide the OTP to complete email verification.`,
        data: {
          pending_email: new_email,
          otp_sent: true,
          ...(process.env.NODE_ENV !== 'production' && {
            dev_otp: generated_otp,
          }),
        },
      });
      return;
    }

    if (!user.pending_email || user.pending_email !== new_email) {
      res.status(400).json({
        success: false,
        message: 'Email update session mismatch. Please request a new OTP.',
      });
      return;
    }

    if (!user.email_otp || user.email_otp !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP code.',
      });
      return;
    }

    if (!user.email_otp_expiry || user.email_otp_expiry < new Date()) {
      res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
      return;
    }

    const duplicate_check = await User.findOne({
      email: new_email,
      is_deleted: false,
      _id: { $ne: user._id },
    });

    if (duplicate_check) {
      res.status(400).json({
        success: false,
        message: 'Email address was registered by another account.',
      });
      return;
    }

    user.email = new_email;
    user.is_email_verified = true;
    user.pending_email = undefined;
    user.email_otp = undefined;
    user.email_otp_expiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email address updated and verified successfully.',
      data: {
        id: user._id,
        email: user.email,
        is_email_verified: user.is_email_verified,
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
