import { UserModel } from './user.model';
import { GroupModel } from './group.model';
import { UserGroupModel } from './userGroup.model';

GroupModel.belongsToMany(UserModel, {
  through: UserGroupModel,
  as: 'users',
  foreignKey: 'groupId',
});

UserModel.belongsToMany(GroupModel, {
  through: UserGroupModel,
  as: 'groups',
  foreignKey: 'userId',
});

export { GroupModel, UserModel, UserGroupModel };
