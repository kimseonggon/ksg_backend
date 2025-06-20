import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { Request } from 'express'
import { RequestContext } from 'nestjs-request-context'
import { Sequelize, Transaction, TransactionOptions } from 'sequelize'

@Injectable()
export class Transactional {
  constructor(
    @InjectConnection('default')
    private readonly sequelizeInstance: Sequelize
  ) { }
  private readonly logger = new Logger(Transactional.name)
  async do<T>(f: (t: Transaction) => Promise<T>, option?: TransactionOptions, outerTransaction?: Transaction, isStandAlone = false) {
    // 크론잡이나 스케줄러 등 http요청없이 백그라운드로 진행되는 로직일 경우  requestContext가 없기 때문에
    // 외부 트랜잭션을 그대로 반환
    // 커밋, 롤백도 외부에서 처리함
    if (isStandAlone && outerTransaction) {
      return f(outerTransaction)
    }

    const req = RequestContext?.currentContext?.req as Request & Record<'transaction', Transaction | null | undefined>
    const isContinuedTransaction = !!req?.transaction

    try {
      if (outerTransaction) {
        req.transaction = outerTransaction
      }
      if (!req.transaction) {
        req.transaction = await this.sequelizeInstance.transaction({
          ...option,
          logging: false,
        })
      }

      const result = await f(req.transaction)
      if (!isContinuedTransaction || outerTransaction) {
        await req.transaction.commit()
      }

      return result
    } catch (err) {
      if (req.transaction && (!isContinuedTransaction || outerTransaction)) {
        await req.transaction.rollback()
      }

      throw err
    }
  }
}
