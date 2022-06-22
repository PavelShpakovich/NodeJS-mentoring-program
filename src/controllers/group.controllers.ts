import { ValidatedRequest } from 'express-joi-validation';
import { v4 as uuidv4 } from 'uuid';
import { RequestGroupSchema } from '../types';
import { Request, Response } from 'express';
import groupService from '../services/group.service';

const genericErrorMessage = 'Error occurred while processing request';

export const addUsersToGroup = async (req: Request, res: Response) => {
  const { groupId, userIds } = req.body;
  try {
    await groupService.addUsersToGroup(groupId, userIds);

    res.json('Success');
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};
export const createGroup = async (req: ValidatedRequest<RequestGroupSchema>, res: Response) => {
  const { name, permissions } = req.body;
  const group = { id: uuidv4(), name, permissions };

  try {
    const groupRecord = await groupService.createGroup(group);
    res.json(`Group with id ${groupRecord.id} has been created`);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groupsList = await groupService.getGroups();
    res.json(groupsList);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const getGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const group = await groupService.getGroupById(id);
    res.json(group);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await groupService.deleteGroup(id);
    res.json(`Group with id: ${id} has been removed`);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};

export const updateGroup = (req: ValidatedRequest<RequestGroupSchema>, res: Response) => {
  const id = req.params.id;
  try {
    groupService.updateGroup({ ...req.body, id });
    res.json(`Group with id: ${id} has been updated`);
  } catch (e: any) {
    res.status(e.status || 500).json({
      status: 'error',
      message: e.message || genericErrorMessage,
    });
  }
};
