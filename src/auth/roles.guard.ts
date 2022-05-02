import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.model';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token)
        throw new HttpException(
          { message: 'Unauthorized user!' },
          HttpStatus.UNAUTHORIZED,
        );

      const user: User = this.jwtService.verify(token);

      req.user = user;

      return user.roles.some((r) => requiredRoles.some((rr) => rr === r.title));
    } catch (e) {
      throw new HttpException('Access forbidden!', HttpStatus.FORBIDDEN);
    }
  }
}
