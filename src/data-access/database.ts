import { Sequelize } from 'sequelize';
import { config } from '../config';

const { DB_PASSWORD, DB_NAME, DB_USER_NAME, DB_HOST } = config;

const db = new Sequelize(DB_NAME as string, DB_USER_NAME as string, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

export default db;
