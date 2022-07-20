import express, { json } from 'express';
import cors from 'cors';
import userRouter from './routes/users.routes';
import groupRouter from './routes/groups.routes';
import loginRouter from './routes/login.route';
import db from './data-access/database';
import { UserModel } from './data-access/models';
import 'dotenv/config';
import { GroupModel } from './data-access/models';
import { UserGroupModel } from './data-access/models';
import loggerMiddleware from './middleware/logger.middleware';
import errorHandlerMiddleware from './middleware/errorHandler.middleware';
import { logger } from './utils/logger';
import { config } from './config';

const { PORT } = config;

const port = PORT || 3000;

const app = express();

app.use(json());
app.use(cors());
app.use(loggerMiddleware);
app.use(loginRouter);
app.use(userRouter);
app.use(groupRouter);
app.use(errorHandlerMiddleware);

const initApp = async () => {
  logger.info('Testing the database connection..');
  try {
    await db.authenticate();
    logger.info('Connection has been established successfully.');

    await UserModel.sync({
      alter: true,
    });

    await GroupModel.sync({
      alter: true,
    });

    await UserGroupModel.sync({
      alter: true,
    });

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};

initApp();
