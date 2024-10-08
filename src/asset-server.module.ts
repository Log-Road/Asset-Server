import { Logger, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "./prisma/prisma.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RoadModule } from "./road/road.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    RoadModule,
    PrismaModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [],
  providers: [JwtService, PrismaService, ConfigService, Logger],
})
export class AssetServerModule {}
