import { ValidatedRequest } from 'express-joi-validation';
import { v4 as uuidv4 } from 'uuid';
import { getAutoSuggestUsers } from '../helpers';
import { IUser, QueryParams, RequestSchema } from '../types';
import { Request, Response } from 'express';

const users: IUser[] = [];

export const createUser = (req: ValidatedRequest<RequestSchema>, res: Response) => {
    const { login, password, age } = req.body;
    const user = { id: uuidv4(), login, password, age, isDeleted: false };
    users.push(user);
    res.json(`User with id ${user.id} has been created`);
};

export const getUsers = (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    const { loginSubstring, limit } = req.query;
    const userList = getAutoSuggestUsers({ loginSubstring, limit: limit ? parseInt(limit, 10) : undefined, users });
    res.json(userList);
};

export const getUser = (req: Request, res: Response) => {
    const id = req.params.id;
    const user = users.find((u) => u.id === id);
    res.json(user);
};

export const deleteUser = (req: Request, res: Response) => {
    const id = req.params.id;
    users.forEach((u) => {
        if (u.id === id) {
            u.isDeleted = true;
        }
    });
    res.status(204).send();
};

export const updateUser = (req: ValidatedRequest<RequestSchema>, res: Response) => {
    const id = req.params.id;
    const { login, password, age } = req.body;
    users.forEach((u) => {
        if (u.id === id) {
            u = { ...u, login, password, age };
        }
    });
    res.status(204).send();
};
