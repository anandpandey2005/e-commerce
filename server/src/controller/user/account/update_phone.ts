import { Response } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { update_phone_schema } from '../../../validations/user.js';

export async function update_phone(
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

    const zod_result = update_phone_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { new_phone, otp } = zod_result.data;

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

    if (
      user.phone.country_code === new_phone.country_code &&
      user.phone.number === new_phone.number
    ) {
      res.status(400).json({
        success: false,
        message:
          'New phone number must be different from current phone number.',
      });
      return;
    }

    if (!otp) {
      const existing_user = await User.findOne({
        'phone.number': new_phone.number,
        is_deleted: false,
        _id: { $ne: user._id },
      });

      if (existing_user) {
        res.status(400).json({
          success: false,
          message: 'An active account with this phone number already exists.',
        });
        return;
      }

      const generated_otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.pending_phone = new_phone;
      user.phone_otp = generated_otp;
      user.phone_otp_expiry = otp_expiry;

      await user.save();

      res.status(200).json({
        success: true,
        message: `OTP sent to ${new_phone.country_code} ${new_phone.number}. Please verify with OTP.`,
        data: {
          pending_phone: new_phone,
          otp_sent: true,
          ...(process.env.NODE_ENV !== 'production' && {
            dev_otp: generated_otp,
          }),
        },
      });
      return;
    }

    if (
      !user.pending_phone ||
      user.pending_phone.number !== new_phone.number ||
      user.pending_phone.country_code !== new_phone.country_code
    ) {
      res.status(400).json({
        success: false,
        message: 'Phone update session mismatch. Please request a new OTP.',
      });
      return;
    }

    if (!user.phone_otp || user.phone_otp !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP code.',
      });
      return;
    }

    if (!user.phone_otp_expiry || user.phone_otp_expiry < new Date()) {
      res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
      return;
    }

    const duplicate_check = await User.findOne({
      'phone.number': new_phone.number,
      is_deleted: false,
      _id: { $ne: user._id },
    });

    if (duplicate_check) {
      res.status(400).json({
        success: false,
        message: 'Phone number was registered by another account.',
      });
      return;
    }

    user.phone = new_phone;
    user.is_phone_verified = true;
    user.pending_phone = undefined;
    user.phone_otp = undefined;
    user.phone_otp_expiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Phone number updated and verified successfully.',
      data: {
        id: user._id,
        phone: user.phone,
        is_phone_verified: user.is_phone_verified,
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
