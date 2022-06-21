import { DataTypes, Model } from 'sequelize';
import { IGroup } from '../../types';
import db from '../database';

export interface GroupInstance extends IGroup, Model {}

export const GroupModel = db.define<GroupInstance>(
  'Groups',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
