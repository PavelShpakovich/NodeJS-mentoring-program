import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const secret = config.JWT_SECRET;

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, secret as string);
    return decoded && next();
  } catch {
    return res.status(403).json({ success: false, message: 'Invalid token provided' });
  }
};

export default checkToken;
