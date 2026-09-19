import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'btk_token';
    let token: string | undefined;

    // Check cookie
    if (req.cookies && req.cookies[cookieName]) {
      token = req.cookies[cookieName];
    }

    // Check authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as administrator.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET missing.' });
      return;
    }

    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please log in again.',
    });
  }
};
