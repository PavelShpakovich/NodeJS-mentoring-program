import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const secret = config.JWT_SECRET;

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  return jwt.verify(token, secret as string, (err, _) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token provided' });
    }

    return next();
  });
};

export default checkToken;
