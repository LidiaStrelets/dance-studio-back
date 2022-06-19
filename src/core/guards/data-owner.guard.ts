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
import { User } from 'src/modules/users/users.model';

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;
// .eyJlbWFpbCI6InRlc3RndWFyZDNAaS51YSIsInJvbGUiOiJjbGllbnQiLCJpZCI6MTksImlhdCI6MTY1NDQ0OTA2MiwiZXhwIjoxNjU0NTM1NDYyfQ
// .YJAa5vEu34bD6e_lx18zv - CIlxH_iQrr3UQT38yYErk;

@Injectable()
export class DataOwnerGuard implements CanActivate {
  constructor(
    @Inject('CoreJwtService')
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

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

      if (user.role.title === 'admin') return true;

      req.user = user;

      return user.id === Number(paramsId);
    } catch (e) {
      throw new HttpException('Access forbidden!', HttpStatus.FORBIDDEN);
    }
  }
}
