import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { clear_token_cookies } from '../../../utils/token.js';

export async function logout(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (req.user) {
      await User.updateOne({ _id: req.user._id }, { $unset: { refresh_token: 1 } });
    }

    clear_token_cookies(res);

    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully.',
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
