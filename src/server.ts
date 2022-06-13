import express, { json } from 'express';
import router from './routes/users.routes';
import db from './data-access/database';
import { UserModel } from './data-access/models/user.model';
import 'dotenv/config';

const { PORT } = process.env;

const port = PORT || 3000;

const app = express();

app.use(json());
app.use(router);

const initApp = async () => {
  console.log('Testing the database connection..');
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    await UserModel.sync({
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
