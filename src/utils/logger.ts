import { createLogger, transports, format } from 'winston';

const myWinstonOptions = {
  format: format.combine(
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...rest }) => {
      if (Object.keys(rest).length !== 0) {
        return `[${timestamp}] ${level}: ${message} - ${JSON.stringify(rest)}`;
      }
      return `[${timestamp}] ${level}: ${message}`;
    }),
    format.colorize({ all: true })
  ),
  transports: [new transports.Console()],
};
export const logger = createLogger(myWinstonOptions);

process
  .on('warning', (warning) => {
    logger.warn(warning);
  })
  .on('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
  })
  .on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit(1);
  });
