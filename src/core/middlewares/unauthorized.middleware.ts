import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, NextFunction } from 'express';
import { RequestService } from '@services/request/request.service';
import { UsersService } from '@usersModule/services/users.service';
import { IToken } from '@authModule/types/types';
import { BEARER, JWT_SERVICE } from '@core/constants';

@Injectable()
export class UnauthorizedMiddleware {
  constructor(
    @Inject(JWT_SERVICE)
    private jwtService: JwtService,
    private requestService: RequestService,
    private userService: UsersService,
  ) {}

  async use(req: Request, _, next: NextFunction) {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      this.throwError();
    }

    const [type, authToken] = authorization.split(' ');

    if (!authToken || type !== BEARER) {
      this.throwError();
    }

    let decoded: IToken;
    try {
      decoded = this.jwtService.verify(authToken);
    } catch (e) {
      this.throwError();
    }

    const candidate = await this.userService.getById(decoded.id);

    if (!candidate) {
      this.throwError();
    }

    this.requestService.setUserId(candidate.id.toString());
    this.requestService.setUserRole(decoded.role);

    next();
  }

  private throwError() {
    throw new HttpException(
      [
        {
          message: ['Unauthorized!'],
        },
      ],
      HttpStatus.UNAUTHORIZED,
    );
  }
}
