import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import nodemailer from 'nodemailer'
import { validate } from 'email-validator'

@Injectable()
export class SenderService {
  constructor() {}

  async sendEmail(dto: any) {
    return await this.sendEmailToToast(dto)
  }

  async sendEmailToToast(dto: any) {
    const { receiver, subject, content } = dto
    if (!validate(receiver)) {
      throw new BadRequestException('유효하지 않은 이메일 주소입니다.')
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      })
      const mailOptions = {
        from: process.env.EMAIL,
        to: receiver,
        subject: subject || 'Welcome!',
        html: content || ``
      }

      await transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('이메일 전송 실패:', error)
      throw new InternalServerErrorException('이메일 전송에 실패했습니다.')
    }
  }
}
