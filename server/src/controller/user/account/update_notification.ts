import { Response } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { update_notification_schema } from '../../../validations/user.js';

export async function update_notification(
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

    const parse_result = update_notification_schema.safeParse(req.body);

    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, sms, push } = parse_result.data;

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

    if (!user.settings) {
      user.settings = {
        theme: 'system',
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      };
    }

    if (!user.settings.notifications) {
      user.settings.notifications = {
        email: true,
        sms: false,
        push: true,
      };
    }

    if (email !== undefined) {
      user.settings.notifications.email = email;
    }
    if (sms !== undefined) {
      user.settings.notifications.sms = sms;
    }
    if (push !== undefined) {
      user.settings.notifications.push = push;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Notification settings updated successfully.',
      data: {
        notifications: user.settings.notifications,
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
