import express, { json, Router } from 'express';
import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { IUser } from './types';
import { createUser, deleteUser, getUser, getUsers, updateUser } from './controllers/user.controllers';
import { checkUserByIdMiddleware } from './middleware/chekUserById.middleware';

const schema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().min(4).max(130).required(),
});

const validator = createValidator();
const bodyValidator = validator.body(schema);

const router = Router();

const app = express();

const users: IUser[] = [];

router.route('/users').post(bodyValidator, createUser(users)).get(getUsers(users));

router
    .route('/users/:id')
    .all(checkUserByIdMiddleware(users))
    .get(getUser(users))
    .delete(deleteUser(users))
    .put(bodyValidator, updateUser(users));

app.use(json());
app.use(router);

app.listen(3000);
