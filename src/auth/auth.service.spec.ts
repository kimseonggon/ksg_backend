// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from 'src/user/user.service'
import { UnauthorizedException } from '@nestjs/common'
import { ResponseUserDto } from 'src/user/dto/user.dto'
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

// bcrypt를 mock 처리
jest.mock('bcrypt', () => ({
  compareSync: jest.fn()
}))

describe('AuthService', () => {
  let service: AuthService
  let redisClientMock: any

  const mockUser = {
    id: 1,
    email: 'shuw75@gmail.com',
    password: 'hashedPassword'
  }

  const userService = {
    findByEmail: jest.fn().mockResolvedValue(mockUser)
  }

  beforeEach(async () => {
    redisClientMock = {
      get: jest.fn(),
      set: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn()
          }
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: redisClientMock
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  it('유저 정보가 존재하지 않으면 UnauthorizedException 발생', async () => {
    userService.findByEmail.mockResolvedValue(null)

    await expect(service.validateUser('test@email.com', '123456')).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('비밀번호가 틀리면 UnauthorizedException 발생', async () => {
    userService.findByEmail.mockResolvedValue(mockUser)
    ;(compareSync as jest.Mock).mockReturnValue(false)

    await expect(service.validateUser('shuw75@gmail.com', 'wrong-password')).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('이메일과 비밀번호가 모두 맞으면 ResponseUserDto 반환', async () => {
    userService.findByEmail.mockResolvedValue(mockUser)
    service['userService'] = userService as any
    ;(compareSync as jest.Mock).mockReturnValue(true)

    const result = await service.validateUser('shuw75@gmail.com', '123456')
    expect(result).toBeInstanceOf(ResponseUserDto)
    expect(result.email).toBe(mockUser.email)
  })
})
