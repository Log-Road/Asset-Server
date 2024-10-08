import { NestFactory } from '@nestjs/core';
import { AssetServerModule } from './asset-server.module';
import { configDotenv } from 'dotenv';
import { WinstonInstance } from 'utils/winston';
import { HttpExceptionFilter } from 'utils/http.exception.filter';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  configDotenv({
    path: '../.env',
  });

  const logger = WinstonModule.createLogger({
    instance: WinstonInstance,
  });

  const app = await NestFactory.create(AssetServerModule, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
  });

  app.connectMicroservice({
    
  })

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: true,
    }),
  );

  await app.listen(Number(process.env.PORT ?? "8081"), () => {
    logger.log(`ASSET-SERVER HAD STARTED`);
  });
}
bootstrap();
