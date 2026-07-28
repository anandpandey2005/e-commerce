import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

export function is_employee(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in first.',
    });
    return;
  }

  const allowed_roles = ['employee'];
  if (!allowed_roles.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Staff/Employee privileges required.',
    });
    return;
  }

  next();
}
