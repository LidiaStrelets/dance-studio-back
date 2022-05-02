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

@Injectable()
export class DataOwnerGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');
      const paramsId = req.params.userId;

      if (bearer !== 'Bearer' || !token)
        throw new HttpException(
          { message: 'Unauthorized user!' },
          HttpStatus.UNAUTHORIZED,
        );

      const user: User = this.jwtService.verify(token);

      if (user.roles.some((r) => r.title === 'admin')) return true;

      req.user = user;

      return user.id === Number(paramsId);
    } catch (e) {
      throw new HttpException('Access forbidden!', HttpStatus.FORBIDDEN);
    }
  }
}
