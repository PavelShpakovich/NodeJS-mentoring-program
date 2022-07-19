import { Response, Request, NextFunction } from 'express';
import { INCOMING_REQUEST_MESSAGE } from '../constants';
import { logger } from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  logger.info({
    message: INCOMING_REQUEST_MESSAGE,
    details: {
      method: req.method,
      query: req.query,
      payload: req.body,
    },
  });

  next();
};

export default loggerMiddleware;
