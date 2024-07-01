import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { configDotenv } from 'dotenv';
import { WinstonInstance } from './utils/winston.util';
import { CorsOptions } from './utils/corsOption.util';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http.exception.filter';

async function bootstrap() {
  configDotenv();

  const app = await NestFactory.create(AppModule, {
    cors: CorsOptions,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
  });

  await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
    options: {
      package: 'road',
      url: '0.0.0.0:50051',
      protoPath: 'src/proto/dias.proto',
      logger: WinstonModule.createLogger({
        instance: WinstonInstance,
      }),
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === ('prod' || 'dev'),
    }),
  );

  await app.startAllMicroservices();

  await app.listen(Number(process.env.PORT ?? '8000'), () => {
    const winstonLogger = WinstonModule.createLogger({instance: WinstonInstance})
    winstonLogger.log(`Asset-Server is running on port ${process.env.PORT ?? 8000}`)
  });
}
bootstrap();
