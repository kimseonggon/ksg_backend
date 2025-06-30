import { IsNotEmpty, IsString } from 'class-validator'

export class EmailSendDto {
  @IsString()
  @IsNotEmpty()
  readonly receiver: string

  @IsString()
  @IsNotEmpty()
  readonly subject: string

  @IsString()
  @IsNotEmpty()
  readonly content: string
}
