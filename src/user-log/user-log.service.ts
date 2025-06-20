import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from 'src/common/decorators/inject-logger.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { UserLog } from './user-log.model';
import { CreateUserLogDto } from './dto/user-log.dto';

@Injectable()
export class UserLogService {
  @InjectLogger()
  private readonly logger: Logger

  constructor(
    @InjectModel(UserLog) private userLogModel: typeof UserLog
  ) { }

  async create(createDto: CreateUserLogDto) {
    return await this.userLogModel.create({
      ...createDto
    })
  }
  async update(dto): Promise<any> {

  }
  async remove(id): Promise<any> {
    await this.userLogModel.destroy({ where: { id: id } })
  }

}
