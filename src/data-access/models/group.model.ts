import { DataTypes, Model } from 'sequelize';
import { IGroup, Permission } from '../../types';
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
      type: DataTypes.ARRAY(
        DataTypes.ENUM(Permission.DELETE, Permission.READ, Permission.SHARE, Permission.UPLOAD_FILES, Permission.WRITE)
      ),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
