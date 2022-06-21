import { Request, Response, NextFunction } from 'express';
import groupService from '../services/group.service';
import userService from '../services/user.service';

export const checkUserByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params?.id;
  const user = await userService.getUserById(id);
  if (user) {
    return next();
  }
  res.status(404).json(`User with id ${id} is not found`);
};

export const checkGroupByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params?.id;
  const user = await groupService.getGroupById(id);
  if (user) {
    return next();
  }
  res.status(404).json(`Group with id ${id} is not found`);
};
