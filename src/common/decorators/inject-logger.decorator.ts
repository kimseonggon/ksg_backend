import { Logger } from '@nestjs/common'

/**
 * 필드 로거 삽입하는 데코레이터
 *
 * @returns Logger
 * @see Logger
 */
export function InjectLogger(name?: string) {
  return (target: any, fieldName: string) => {
    target[fieldName] = new Logger(name || target.constructor.name)
  }
}
