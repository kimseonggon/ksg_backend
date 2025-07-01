// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // ✅ 경로 alias 대응
    '^@/(.*)$': '<rootDir>/src/$1' // ✅ @ 경로 대응 (있다면)
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.', // 루트 디렉토리 설정
  testMatch: ['**/*.spec.ts']
}
export default config
