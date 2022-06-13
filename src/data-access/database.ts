import { Sequelize } from 'sequelize';
import 'dotenv/config';

const { DB_PASSWORD, DB_NAME, DB_USER_NAME, DB_HOST } = process.env;

const db = new Sequelize(DB_NAME as string, DB_USER_NAME as string, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

export default db;
