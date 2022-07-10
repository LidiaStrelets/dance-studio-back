import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@services/request.service';
import { UsersService } from '@usersModule/users.service';

@Injectable()
export class UnauthorizedMiddleware {
  constructor(
    @Inject('CoreJwtService')
    private jwtService: JwtService,
    private requestService: RequestService,
    private userService: UsersService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throw new HttpException(
        [
          {
            message: ['Unauthorized!'],
            problem_field: null,
            name: 'Unauthorized Error - no token',
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [type, authToken] = authorization.split(' ');

    if (!authToken || type !== 'Bearer') {
      throw new HttpException(
        [
          {
            message: ['Unauthorized!'],
            problem_field: null,
            name: 'Unauthorized Error - invalid token',
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }

    const decoded = this.jwtService.verify(authToken);

    const candidate = await this.userService.getById(decoded.id);

    if (!candidate) {
      throw new HttpException(
        [
          {
            message: ['Unauthorized!'],
            problem_field: null,
            name: 'Unauthorized Error - no user',
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.requestService.setUserId(candidate.id.toString());
    this.requestService.setUserRole(decoded.roles.join(','));

    next();
  }
}
