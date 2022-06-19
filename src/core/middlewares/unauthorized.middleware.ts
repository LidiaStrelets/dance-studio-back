import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/users.model';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/request.service';

@Injectable()
export class UnauthorizedMiddleware {
  constructor(
    @Inject('CoreJwtService')
    private jwtService: JwtService,
    private requestService: RequestService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
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

    const [type, authToken] = authorization.split(' ');

    if (!authToken || type !== 'Bearer') {
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

    const decoded = this.jwtService.verify(authToken);

    const candidate = await User.findOne({ where: { id: decoded.id } });

    if (!candidate) {
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

    this.requestService.setUserId(candidate.id.toString());
    this.requestService.setUserRole(candidate.role.title);

    next();
  }
}
