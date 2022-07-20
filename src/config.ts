import 'dotenv/config';

const { PORT, DB_PASSWORD, DB_NAME, DB_USER_NAME, DB_HOST, JWT_SECRET } = process.env;

export const config = {
  PORT,
  DB_PASSWORD,
  DB_NAME,
  DB_USER_NAME,
  DB_HOST,
  JWT_SECRET,
};
