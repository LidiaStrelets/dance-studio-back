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
export class IsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

      return !!user;
    } catch (e) {
      throw new HttpException('Access forbidden!', HttpStatus.FORBIDDEN);
    }
  }
}
