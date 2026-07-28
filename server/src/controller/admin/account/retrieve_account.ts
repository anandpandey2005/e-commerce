import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.js';

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

    const { _id, full_name, email, phone, role, avatar, settings, createdAt, updatedAt } = req.user;

    res.status(200).json({
      success: true,
      message: 'Admin account details retrieved successfully.',
      data: {
        admin: {
          _id,
          full_name,
          email,
          phone,
          role,
          avatar,
          settings,
          createdAt,
          updatedAt,
        },
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
