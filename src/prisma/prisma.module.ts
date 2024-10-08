import { Logger, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [PrismaService, ConfigService, Logger],
  exports: [PrismaService],
})
export class PrismaModule {}
