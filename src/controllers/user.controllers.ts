import { ValidatedRequest } from 'express-joi-validation';
import { v4 as uuidv4 } from 'uuid';
import { QueryParams, RequestUserSchema } from '../types';
import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';
import { dbErrorLogger } from '../helpers/dbErrorLoger';
import { DB_ERROR_NAME, EXTERNAL_ERROR_MESSAGE } from '../constants';

export const createUser = async (req: ValidatedRequest<RequestUserSchema>, res: Response, next: NextFunction) => {
  const { login, password, age } = req.body;
  const user = { id: uuidv4(), login, password, age };
  try {
    const userRecord = await userService.createUser(user);
    res.json(`User with id ${userRecord.id} has been created`);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'createUser', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const getUsers = async (req: Request<{}, {}, {}, QueryParams>, res: Response, next: NextFunction) => {
  try {
    const userList = await userService.getUsers(req.query);
    res.json(userList);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'getUsers', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'getUser', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    await userService.deleteUser(id);
    res.json(`User with id ${id} has been removed`);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'deleteUser', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const updateUser = async (req: ValidatedRequest<RequestUserSchema>, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    await userService.updateUser({ ...req.body, id });
    res.json(`User with id ${id} has been updated`);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'updateUser', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};
