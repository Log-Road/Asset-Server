import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GrpcJwtAuthGuard } from '../jwt/jwt.auth.guard';

@Injectable()
export class JwtValidateGuard implements CanActivate {
  @Inject()
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const bearerToken: string = await req.headers['authorization'];

    if (!bearerToken) {
      req.body.user = null;
    } else {
      if (!bearerToken.startsWith('Bearer '))
        throw new UnauthorizedException('토큰 형식 오류');
      // await new GrpcJwtAuthGuard((),
      // ).canActivate(context);
    }

    return true;
  }
}
