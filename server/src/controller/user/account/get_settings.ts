import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';

export async function get_settings(
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
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    const default_settings = {
      theme: 'system',
      currency: 'INR',
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    };

    res.status(200).json({
      success: true,
      message: 'User settings retrieved successfully.',
      data: {
        settings: user.settings || default_settings,
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
