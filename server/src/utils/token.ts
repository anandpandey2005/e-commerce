import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export function generate_tokens(
  user_id: string | Types.ObjectId,
  role: string
): TokenPair {
  const access_secret =
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    'default_jwt_access_secret_key';
  const refresh_secret =
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    'default_jwt_refresh_secret_key';

  const access_token = jwt.sign(
    { id: user_id.toString(), role },
    access_secret,
    { expiresIn: '15m' }
  );

  const refresh_token = jwt.sign(
    { id: user_id.toString(), role },
    refresh_secret,
    { expiresIn: '7d' }
  );

  return { access_token, refresh_token };
}

export function set_token_cookies(
  res: Response,
  access_token: string,
  refresh_token: string
): void {
  const is_production = process.env.NODE_ENV === 'production';

  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: is_production,
    sameSite: is_production ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: is_production,
    sameSite: is_production ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clear_token_cookies(res: Response): void {
  const is_production = process.env.NODE_ENV === 'production';

  res.clearCookie('access_token', {
    httpOnly: true,
    secure: is_production,
    sameSite: is_production ? 'none' : 'lax',
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: is_production,
    sameSite: is_production ? 'none' : 'lax',
  });
}
