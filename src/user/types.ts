export enum UserForgotType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL'
}

export function isUserForgotType(v: unknown): v is UserForgotType {
  return typeof v === 'string' && v in UserForgotType
}
