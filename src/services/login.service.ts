import jwt from 'jsonwebtoken';
import { ModelStatic } from 'sequelize/types';
import { config } from '../config';
import { UserInstance, UserModel } from '../data-access/models/user.model';

const secret = config.JWT_SECRET;

interface ILoginService {
  userModel: ModelStatic<UserInstance>;
  createToken(payload: { username: string; password: string }): Promise<string | null>;
}

class LoginService implements ILoginService {
  userModel;
  constructor(userModel: ModelStatic<UserInstance>) {
    this.userModel = userModel || {};
  }

  async createToken({ username, password }: { username: string; password: string }): Promise<string | null> {
    const user = await this.userModel.findOne({ where: { login: username, password } });
    if (!user) {
      return null;
    }

    const payload = { sub: user.id, username };
    const token = jwt.sign(payload, secret as string, { expiresIn: '180s' });

    return token;
  }
}

export default new LoginService(UserModel);
