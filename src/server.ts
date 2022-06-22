import express, { json } from 'express';
import userRouter from './routes/users.routes';
import groupRouter from './routes/groups.routes';
import db from './data-access/database';
import { UserModel } from './data-access/models';
import 'dotenv/config';
import { GroupModel } from './data-access/models';
import { UserGroupModel } from './data-access/models';

const { PORT } = process.env;

const port = PORT || 3000;

const app = express();

app.use(json());
app.use(userRouter);
app.use(groupRouter);

const initApp = async () => {
  console.log('Testing the database connection..');
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

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
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initApp();
