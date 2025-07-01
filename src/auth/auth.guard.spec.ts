import { AuthGuard } from './auth.guard'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { testUserToken } from './test/auth-request.mock'
import { createMock } from '@golevelup/ts-jest'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'

describe('인증 가드 테스트', () => {
  let service: AuthService
  let token: string
  let tokenKey: string
  let userInfo: any
  let redisClientMock: any

  beforeAll(async () => {
    const userToken = testUserToken()
    tokenKey = Object.keys(userToken)[0]
    token = 'Bearer ' + tokenKey
    userInfo = Object.values(userToken)[0]

    redisClientMock = {
      get: jest.fn(),
      set: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('가드 유닛 테스트 구성 확인 ', async () => {
    const guard = new AuthGuard(new Reflector(), service)
    expect(guard).toBeDefined()
  })

  it('로그인 안된 사용자는 가드를 통과하면 안된다.', async () => {
    const guard = new AuthGuard(new Reflector(), service)
    const mockContext = createMock<ExecutionContext>()
    mockContext.switchToHttp().getRequest.mockReturnValue({
      headers: {}
    })

    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException)
  })

  it('유효한 토큰이 있을 경우 가드를 통과한다.', async () => {
    // ✅ redisClient.get이 userInfo를 반환하도록 설정
    redisClientMock.get.mockResolvedValue(JSON.stringify(userInfo))

    const guard = new AuthGuard(new Reflector(), service)
    const mockContext = createMock<ExecutionContext>()
    mockContext.switchToHttp().getRequest.mockReturnValue({
      headers: {
        authorization: token
      }
    })

    const canActivate = await guard.canActivate(mockContext)
    expect(canActivate).toBe(true)
  })
})
