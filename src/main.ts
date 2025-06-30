import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// src/main.ts
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug']
  })
  // main.ts
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    credentials: true,
  })

  const logger = new Logger('Bootstrap')
  logger.log('NestJS 서버 시작됨')
  await app.listen(4010)
}
bootstrap();
