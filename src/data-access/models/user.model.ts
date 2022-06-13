import { DataTypes, Model } from 'sequelize';
import { IUser } from '../../types';
import db from '../database';

export interface UserInstance extends IUser, Model {}

export const UserModel = db.define<UserInstance>(
  'Users',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
