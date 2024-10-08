import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class GrpcJwtAuthGuard implements CanActivate, OnModuleInit {
  constructor() {}

  private guard;

  onModuleInit() {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();

    const token: string = req.headers["authorization"];

    if (!token) throw new UnauthorizedException("토큰 필요");
    if (!token.includes(" ")) throw new UnauthorizedException("토큰 형식 오류");


    return true;
  }
}
