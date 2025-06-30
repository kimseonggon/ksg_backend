import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectLogger } from 'src/common/decorators/inject-logger.decorator'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model'
import { hash } from 'bcrypt'
import { ResponseUserDto, SearchUserDto, SelectUserDto } from './dto/user.dto'
import { toLimit } from 'src/common/requests'
import { FixedPageResult } from 'src/lib/dto/common.dto'
import { compare, getTotalPages } from 'src/utils'
import { UserLog } from 'src/user-log/user-log.model'
import { Transactional } from 'src/common/sequelize'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { RedisService } from 'src/redis/redis.service'
import { UserForgot } from 'src/user-forgot/user-forgot.model'
import { randomInt } from 'crypto'
import { UserForgotType } from './types'
import dayjs from 'src/utils/dayjs'

@Injectable()
export class UserService {
  @InjectLogger()
  private readonly logger: Logger

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(UserLog) private userLogModel: typeof UserLog,
    @InjectModel(UserForgot) private userForgotModel: typeof UserForgot,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private transactional: Transactional,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async create(userInfo: User): Promise<ResponseUserDto> {
    const hashPassword: Buffer = await this.hashPassword(userInfo.password)
    return this.transactional.do(async (t) => {
      const user = await this.userModel.create(
        {
          ...userInfo,
          password: hashPassword
        },
        {
          transaction: t
        }
      )

      const change = compare({
        after: user.get()
      })
      await this.userLogModel.create(
        {
          userId: user.id,
          change,
          description: 'USER를 생성했습니다.'
        },
        {
          transaction: t
        }
      )
      return new ResponseUserDto(user)
    })
  }
  async update(dto): Promise<any> {}
  async remove(dto): Promise<any> {
    const ids = dto.ids
    await this.userModel.destroy({ where: { id: ids } })
    ids.forEach((id) => {
      this.logout(id)
    })
    return { success: true }
  }

  async list(dto: SearchUserDto) {
    const { page = 1, pageSize = 20 } = dto
    const limit = toLimit(dto, page, pageSize)
    const condition = this.toConditionForFindAll(dto)

    const { rows, count } = await this.userModel.findAndCountAll({
      attributes: {
        exclude: ['password', 'deletedAt', 'isActive'] // 제외할 컬럼
      },
      ...condition,
      ...limit,
      order: [['id', 'DESC']]
    })

    const totalPage: number = getTotalPages(count, pageSize)

    const result: FixedPageResult<SelectUserDto> = {
      page,
      pageSize,
      rowCount: rows.length,
      totalPage,
      total: count,
      order: 'id_DESC',
      data: rows
    }

    return result
  }

  async me(): Promise<User | null> {
    return null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email }, raw: true })
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findOne({
      where: { id },
      raw: true,
      attributes: {
        exclude: ['password', 'deletedAt', 'isActive'] // 제외할 컬럼
      }
    })
  }

  async findOneByUserEmail(email: string) {
    return this.userModel.findOne({ where: { email } })
  }

  async createForgotNumber(user: any, type: UserForgotType) {
    const verificationNumber = randomInt(100_000, 1_000_000) // 6자리
    const expiredAfter = dayjs().add(30, 'minute').toDate()
    await this.userForgotModel.destroy({ where: { userId: user.id } })

    const forgot = await this.userForgotModel.create({
      userId: user.id,
      type,
      verificationNumber,
      expiredAfter
    })

    return forgot
  }

  async changePasswordWithForgotNumber(verificationNumber, password) {
    const row = await this.getRecentForgotNumber(verificationNumber)
    if (!row || !this.isValidForgotNumber(row)) {
      throw new BadRequestException('인증 정보가 유효하지 않습니다.')
    }

    const hashPassword = await this.hashPassword(password)
    const user = await this.userModel.findOne({ where: { id: row.userId }, raw: true })
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.')
    }
    await this.userModel.update({ password: hashPassword }, { where: { id: user.id } })
    await this.userForgotModel.destroy({ where: { id: row.id } })
  }

  async getRecentForgotNumber(verificationNumber) {
    return await this.userForgotModel.findOne({
      where: { verificationNumber },
      raw: true,
      order: [['id', 'DESC']]
    })
  }

  isValidForgotNumber(row: UserForgot): row is UserForgot {
    return !!row && dayjs(row.expiredAfter).isAfter(dayjs())
  }

  private toConditionForFindAll(dto: SearchUserDto) {
    const { email, name, phone } = dto

    const condition = {
      where: {
        ...(email && { email }),
        ...(name && { name }),
        ...(phone && { phone })
      }
    }
    return condition
  }

  /**
   *
   * @param email 확인할 User ID
   * @throws ConflictException 이미 사용중인 계정이 있을 경우
   */
  async isUniqueEmail(email: string) {
    const findUser = await this.findByEmail(email)
    if (findUser) {
      throw new ConflictException(`${email}는 이미 사용중인 이메일입니다. 다시 확인해주세요.`)
    }
    return true
  }

  /**
   * 패스워드 암호화
   * @param password 해싱할 패스워드
   * @returns hashed password
   * @throws {BadRequestException} - 해싱처리시 오류 발생시
   */
  private async hashPassword(password: string): Promise<Buffer> {
    try {
      const hashedPassword: string = await hash(password, 12)
      return Buffer.from(hashedPassword)
    } catch (error) {
      this.logger.warn('패스워드 해싱 처리 실패', error)
      throw new BadRequestException('비밀번호로 사용할 수 없는 값입니다.')
    }
  }

  async logout(id: number) {
    const tokens = await this.redis.get(`userId:${id}`)
    if (tokens) {
      const { accessToken } = JSON.parse(tokens)
      const decoded = this.jwtService.decode(accessToken) as { exp: number }
      const now = Math.floor(Date.now() / 1000)
      const ttl = decoded.exp - now

      if (ttl > 0) {
        await this.redisService.blacklistToken(accessToken, ttl)
      }
    }
  }
}
