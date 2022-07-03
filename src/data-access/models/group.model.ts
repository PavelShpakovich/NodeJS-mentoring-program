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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        customValidator: (array: Permission[]) => {
          const enums: Permission[] = [
            Permission.DELETE,
            Permission.READ,
            Permission.SHARE,
            Permission.UPLOAD_FILES,
            Permission.WRITE,
          ];
          if (!array.every((item) => enums.includes(item))) {
            throw new Error('Not a valid option');
          }
        },
      },
    },
  },
  {
    timestamps: false,
  }
);
