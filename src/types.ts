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

export interface RequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}
