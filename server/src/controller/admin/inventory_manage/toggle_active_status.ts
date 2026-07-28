import { Request, Response } from 'express';
import { toggle_status } from '../../common/toggle_status.js';

export async function toggle_active(req: Request, res: Response): Promise<void> {
  return toggle_status(req, res);
}