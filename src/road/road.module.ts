import { Logger, Module } from "@nestjs/common";
import { RoadService } from "./road.service";
import { RoadController } from "./road.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { GrpcJwtAuthGuard } from "guard/jwt/jwt.auth.guard";


@Module({
  providers: [
    RoadService,
    PrismaService,
    GrpcJwtAuthGuard,
    JwtService,
    Logger,
  ],
  controllers: [RoadController],
})
export class RoadModule {}
