import express, { json, Request, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation';

interface IUser {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

interface QueryParams {
    loginSubstring: string;
    limit: string;
}

interface IGetAutoSuggestUsers {
    loginSubstring?: string;
    limit?: number;
}

const schema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().min(4).max(130).required()
});

interface RequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string;
        password: string;
        age: number;
    };
}

const validator = createValidator();

const router = Router();

const app = express();

const getAutoSuggestUsers = ({ loginSubstring = '', limit = 100 }: IGetAutoSuggestUsers): IUser[] => {
    return users
        .filter((u) => u.login.startsWith(loginSubstring))
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(0, limit);
};

const users: IUser[] = [];

router
    .route('/users')
    .post(validator.body(schema), (req: ValidatedRequest<RequestSchema>, res) => {
        const { login, password, age } = req.body;
        const user = { id: uuidv4(), login, password, age, isDeleted: false };
        users.push(user);
        res.json(`User with id ${user.id} has been created`);
    })
    .get((req: Request<{}, {}, {}, QueryParams>, res) => {
        const { loginSubstring, limit } = req.query;
        const userList = getAutoSuggestUsers({ loginSubstring, limit: limit ? parseInt(limit, 10) : undefined });
        res.json(userList);
    });

router
    .route('/users/:id')
    .all((req, res, next) => {
        const id = req.params.id;
        const user = users.find((u) => u.id === id);
        if (user) {
            return next();
        }
        res.status(404).json(`User with id ${id} is not found`);
    })
    .get((req, res) => {
        const id = req.params.id;
        const user = users.find((u) => u.id === id);
        res.json(user);
    })
    .delete((req, res) => {
        const id = req.params.id;
        users.forEach((u) => {
            if (u.id === id) {
                u.isDeleted = true;
            }
        });
        res.status(204).send();
    })
    .put(validator.body(schema), (req: ValidatedRequest<RequestSchema>, res) => {
        const id = req.params.id;
        const { login, password, age } = req.body;
        users.forEach((u) => {
            if (u.id === id) {
                u = { ...u, login, password, age };
            }
        });
        res.status(204).send();
    });

app.use(json());
app.use(router);

app.listen(3000);
