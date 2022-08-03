import express, { json } from 'express';
import cors from 'cors';
import userRouter from './routes/users.routes';
import groupRouter from './routes/groups.routes';
import loginRouter from './routes/login.route';
import 'dotenv/config';
import loggerMiddleware from './middleware/logger.middleware';
import errorHandlerMiddleware from './middleware/errorHandler.middleware';

const app = express();

app.use(json());
app.use(cors());
app.use(loggerMiddleware);
app.use(loginRouter);
app.use(userRouter);
app.use(groupRouter);
app.use(errorHandlerMiddleware);

export default app;
