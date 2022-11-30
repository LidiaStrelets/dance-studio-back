import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { RequestService } from '@services/request/request.service';
import { Roles } from '@core/types';

@Injectable()
export class DataOwnerOrAdminMiddleware {
  constructor(private requestService: RequestService) {}

  use(req: Request, _, next: NextFunction) {
    const userId = this.requestService.getUserId();
    const userRole = this.requestService.getUserRole();

    if (userRole === Roles.client && req.params.userId !== userId) {
      throw new HttpException(
        [
          {
            message: ['Access forbidden!'],
          },
        ],
        HttpStatus.FORBIDDEN,
      );
    }
    next();
  }
}
