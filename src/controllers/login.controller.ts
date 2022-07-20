import { NextFunction, Request, Response } from 'express';
import { DB_ERROR_NAME, EXTERNAL_ERROR_MESSAGE } from '../constants';
import { dbErrorLogger } from '../helpers/dbErrorLoger';
import loginService from '../services/login.service';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const token = await loginService.createToken({ username, password });
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bad username/password combination',
      });
    }
    return res.json({
      succes: true,
      token,
    });
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'login', payload: req.body });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};
