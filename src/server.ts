import db from './data-access/database';
import { UserModel } from './data-access/models';
import 'dotenv/config';
import { GroupModel } from './data-access/models';
import { UserGroupModel } from './data-access/models';
import { logger } from './utils/logger';
import { config } from './config';
import app from './app';

const { PORT } = config;

const port = PORT || 3000;

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
