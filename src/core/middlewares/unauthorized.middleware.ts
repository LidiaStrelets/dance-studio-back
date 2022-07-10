import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@services/request.service';
import { UsersService } from '@usersModule/services/users.service';
import { BEARER } from '@authModule/types/types';

@Injectable()
export class UnauthorizedMiddleware {
  constructor(
    @Inject('CoreJwtService')
    private jwtService: JwtService,
    private requestService: RequestService,
    private userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throwError();
    }

    const [type, authToken] = authorization.split(' ');

    if (!authToken || type !== BEARER) {
      throwError();
    }

    const decoded = this.jwtService.verify(authToken);

    const candidate = await this.userService.getById(decoded.id);

    if (!candidate) {
      throwError();
    }

    this.requestService.setUserId(candidate.id.toString());
    this.requestService.setUserRole(decoded.roles.join(','));

    next();
  }
}

function throwError() {
  throw new HttpException(
    [
      {
        message: ['Unauthorized!'],
        problem_field: null,
        name: 'Unauthorized Error',
      },
    ],
    HttpStatus.UNAUTHORIZED,
  );
}
