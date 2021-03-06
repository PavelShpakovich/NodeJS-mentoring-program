import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export interface IUser {
  id: string;
  login: string;
  password: string;
  age: number;
}

export interface QueryParams {
  loginSubstring: string;
  limit: string;
}

export interface RequestUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES',
}

export interface RequestGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    password: string;
    permissions: Permission[];
  };
}

export interface IGroup {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface IUserGroup {
  userId: string;
  groupId: string;
}
