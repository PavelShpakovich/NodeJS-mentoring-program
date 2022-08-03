import { ValidatedRequest } from 'express-joi-validation';
import { v4 as uuidv4 } from 'uuid';
import { RequestGroupSchema } from '../types';
import { NextFunction, Request, Response } from 'express';
import groupService from '../services/group.service';
import { dbErrorLogger } from '../helpers/dbErrorLoger';
import { DB_ERROR_NAME, EXTERNAL_ERROR_MESSAGE } from '../constants';

export const addUsersToGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId, userIds } = req.body;
  try {
    await groupService.addUsersToGroup(groupId, userIds);

    res.json('Success');
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'addUsersToGroup', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};
export const createGroup = async (req: ValidatedRequest<RequestGroupSchema>, res: Response, next: NextFunction) => {
  const { name, permissions } = req.body;
  const group = { id: uuidv4(), name, permissions };

  try {
    const groupRecord = await groupService.createGroup(group);
    res.json(`Group with id ${groupRecord.id} has been created`);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'createGroup', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupsList = await groupService.getGroups();
    res.json(groupsList);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'getGroups', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const group = await groupService.getGroupById(id);
    res.json(group);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'getGroup', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    await groupService.deleteGroup(id);
    res.json(`Group with id ${id} has been removed`);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'deleteGroup', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};

export const updateGroup = async (req: ValidatedRequest<RequestGroupSchema>, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    await groupService.updateGroup({ ...req.body, id });
    res.json(`Group with id ${id} has been updated`);
  } catch (e: any) {
    if (e.name !== DB_ERROR_NAME) return next(e);

    dbErrorLogger({ message: EXTERNAL_ERROR_MESSAGE, method: 'updateGroup', payload: req.body, query: req.query });

    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || EXTERNAL_ERROR_MESSAGE,
    });
  }
};
