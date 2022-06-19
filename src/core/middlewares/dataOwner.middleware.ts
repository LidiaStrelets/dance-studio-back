import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/users.model';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/request.service';

@Injectable()
export class DataOwnerOrAdminMiddleware {
  constructor(private requestService: RequestService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = this.requestService.getUserId();
    const userRole = this.requestService.getUserRole();

    if (userRole !== 'admin' && req.params.userId !== userId) {
      throw new HttpException(
        [
          {
            message: ['Access forbidden!'],
            problem_field: null,
            name: 'Forbidden Error',
          },
        ],
        HttpStatus.FORBIDDEN,
      );
    }
    next();
  }
}
