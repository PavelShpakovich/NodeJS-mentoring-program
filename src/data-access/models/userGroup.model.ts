import { DataTypes, Model } from 'sequelize';
import { IUserGroup } from '../../types';
import db from '../database';

interface IUserGroupInstance extends IUserGroup, Model {}

export const UserGroupModel = db.define<IUserGroupInstance>('UserGroup', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id',
    },
  },
});
