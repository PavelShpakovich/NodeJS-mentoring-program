import { Request } from 'express';
import { QueryParams } from '../types';
import { logger } from '../utils/logger';

interface IDbErrorLogger {
  message: string;
  method: string;
  payload?: Request['body'];
  query?: Request['query'] | Request<{}, {}, {}, QueryParams>['query'];
}

export const dbErrorLogger = ({ message, method, payload, query }: IDbErrorLogger): void => {
  logger.error({
    message,
    details: {
      method,
      payload,
      query,
    },
  });
};
