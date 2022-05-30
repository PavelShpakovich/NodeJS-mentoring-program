import express, { json } from 'express';
import router from './routes/users.routes';

const app = express();

app.use(json());
app.use(router);

app.listen(3000);
