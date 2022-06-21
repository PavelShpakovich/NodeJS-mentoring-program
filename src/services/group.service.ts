import { ModelStatic } from 'sequelize/types';
import db from '../data-access/database';
import { UserModel, GroupModel } from '../data-access/models';
import { UserInstance } from '../data-access/models/user.model';
import { GroupInstance } from '../data-access/models/group.model';
import { IGroup } from '../types';

interface IGroupService {
  groupModel: ModelStatic<GroupInstance>;
  createGroup(group: IGroup): Promise<GroupInstance>;
  getGroups(): Promise<GroupInstance[]>;
  getGroupById(id: string): Promise<GroupInstance | null>;
  updateGroup(group: IGroup): Promise<void>;
  deleteGroup(id: string): Promise<void>;
}

class GroupService implements IGroupService {
  groupModel;
  userModel;
  constructor(groupModel: ModelStatic<GroupInstance>, userModel: ModelStatic<UserInstance>) {
    this.groupModel = groupModel || {};
    this.userModel = userModel || {};
  }

  async createGroup(group: IGroup) {
    const groupRecord = await this.groupModel.create({ ...group });
    return groupRecord;
  }

  async getGroups() {
    const groups = await this.groupModel.findAll();
    return groups;
  }

  async getGroupById(id: string) {
    const group = await this.groupModel.findByPk(id);
    return group;
  }

  async updateGroup(group: IGroup) {
    await this.groupModel.update(group, {
      where: {
        id: group.id,
      },
    });
  }

  async deleteGroup(id: string) {
    await this.groupModel.destroy({
      where: {
        id,
      },
    });
  }

  async addUsersToGroup(groupId: string, userIds: string[]) {
    const transaction = await db.transaction();

    try {
      const group = await this.groupModel.findByPk(groupId, { transaction });

      if (!group) {
        throw new Error(`Group with id ${groupId} isn't exist!`);
      }

      for (const id of userIds) {
        const user = await this.userModel.findByPk(id, { transaction });
        if (!user) {
          throw new Error(`User with id ${id} isn't exist!`);
        }
        await (group as any)?.addUsers(user, { transaction });
      }

      await transaction.commit();
    } catch (error: any) {
      await transaction.rollback();
      throw new Error(error);
    }
  }
}

export default new GroupService(GroupModel, UserModel);
