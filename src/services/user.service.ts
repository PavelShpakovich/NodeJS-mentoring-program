import { Op } from 'sequelize';
import { ModelStatic } from 'sequelize/types';
import { UserInstance, UserModel } from '../data-access/models/user.model';
import { IUser, QueryParams } from '../types';

interface IUserService {
    userModel: ModelStatic<UserInstance>;
    createUser(user: IUser): Promise<UserInstance>;
}

class UserService implements IUserService {
    userModel;
    constructor(userModel: ModelStatic<UserInstance>) {
        this.userModel = userModel || {};
    }

    async createUser(user: IUser) {
        const userRecord = await this.userModel.create({ ...user });
        return userRecord;
    }

    async getUsers({ limit = '100', loginSubstring = '' }: QueryParams) {
        const users = await this.userModel.findAll({
            limit: parseInt(limit, 10),
            where: {
                login: {
                    [Op.substring]: `${loginSubstring}`,
                },
            },
            order: [['login', 'ASC']],
        });
        return users;
    }

    async getUserById(id: string) {
        const user = await this.userModel.findByPk(id);
        return user;
    }

    async updateUser(user: IUser) {
        await this.userModel.update(user, {
            where: {
                id: user.id,
            },
        });
    }

    async deleteUser(id: string) {
        await this.userModel.destroy({
            where: {
                id,
            },
        });
    }
}

export default new UserService(UserModel);
