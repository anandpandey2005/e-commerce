import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User_User } from '../models/user.js';
import { IUser } from '../models/types/user.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export async function authenticate_user(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth_header = req.headers.authorization;
    let token: string | undefined;

    if (auth_header && auth_header.startsWith('Bearer ')) {
      token = auth_header.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'] as string;
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid.',
      });
      return;
    }

    const jwt_secret =
      process.env.JWT_ACCESS_SECRET ||
      process.env.JWT_SECRET ||
      'default_jwt_access_secret_key';
    const decoded = jwt.verify(token, jwt_secret) as { id: string };

    const user = await User_User.findOne({ _id: decoded.id, is_deleted: false });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User account not found or has been deleted.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized access. Token verification failed.',
    });
    return;
  }
}
