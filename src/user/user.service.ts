import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User
  ) { }

  async me(): Promise<User | null> {
    return null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email }, raw: true });
  }
}
