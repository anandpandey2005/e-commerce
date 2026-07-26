import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';

export async function retrieve_account(
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

    const user = await User.findOne({
      _id: req.user._id,
      is_deleted: false,
    }).select(
      '-password -refresh_token -otp -otp_expiry -email_otp -email_otp_expiry -phone_otp -phone_otp_expiry'
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Account details retrieved successfully.',
      data: {
        user,
      },
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
