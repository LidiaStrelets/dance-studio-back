import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '@usersModule/users.model';
import { ROLES_KEY } from '@decorators/roles.decorator';
import { BEARER } from '@authModule/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject('CoreJwtService')
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: [string] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== BEARER || !token) {
      throw new HttpException(
        { message: 'Unauthorized user!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user: User = this.jwtService.verify(token);

    req.user = user;

    return requiredRoles.some((requiredRole) =>
      user.roles.some((userRole) => userRole.title === requiredRole),
    );
  }
}
