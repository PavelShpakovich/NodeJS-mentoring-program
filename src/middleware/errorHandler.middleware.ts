import { Response, Request, NextFunction } from 'express';
import { INTERNAL_ERROR_MESSAGE } from '../constants';
import { logger } from '../utils/logger';

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): Response | void => {
  if (err) {
    logger.error(INTERNAL_ERROR_MESSAGE, err);
    return res.status(500).json({
      status: 'error',
      message: INTERNAL_ERROR_MESSAGE,
    });
  }

  next();
};

export default errorHandlerMiddleware;
