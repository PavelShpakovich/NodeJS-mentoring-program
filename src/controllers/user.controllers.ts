import { ValidatedRequest } from 'express-joi-validation';
import { v4 as uuidv4 } from 'uuid';
import { QueryParams, RequestUserSchema } from '../types';
import { Request, Response } from 'express';
import userService from '../services/user.service';

const genericErrorMessage = 'Error occurred while processing request';

export const createUser = async (req: ValidatedRequest<RequestUserSchema>, res: Response) => {
  const { login, password, age } = req.body;
  const user = { id: uuidv4(), login, password, age };

  try {
    const userRecord = await userService.createUser(user);
    res.json(`User with id ${userRecord.id} has been created`);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const getUsers = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const userList = await userService.getUsers(req.query);
    res.json(userList);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await userService.deleteUser(id);
    res.json(`User with id: ${id} has been removed`);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const updateUser = (req: ValidatedRequest<RequestUserSchema>, res: Response) => {
  const id = req.params.id;
  try {
    userService.updateUser({ ...req.body, id });
    res.json(`User with id: ${id} has been updated`);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};
