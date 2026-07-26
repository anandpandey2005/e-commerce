import { Response } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { update_settings_schema } from '../../../validations/user.js';

export async function update_settings(
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

    const zod_result = update_settings_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const update_data = zod_result.data;

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

    if (update_data.theme !== undefined) {
      user.settings.theme = update_data.theme;
    }
    if (update_data.currency !== undefined) {
      user.settings.currency = update_data.currency;
    }
    if (update_data.language !== undefined) {
      user.settings.language = update_data.language;
    }

    if (update_data.notifications !== undefined) {
      if (!user.settings.notifications) {
        user.settings.notifications = {
          email: true,
          sms: false,
          push: true,
        };
      }
      if (update_data.notifications.email !== undefined) {
        user.settings.notifications.email = update_data.notifications.email;
      }
      if (update_data.notifications.sms !== undefined) {
        user.settings.notifications.sms = update_data.notifications.sms;
      }
      if (update_data.notifications.push !== undefined) {
        user.settings.notifications.push = update_data.notifications.push;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User settings updated successfully.',
      data: {
        settings: user.settings,
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
