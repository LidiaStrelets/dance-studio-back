import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@services/request.service';
import { Roles } from '@rolesModule/types/types';

@Injectable()
export class DataOwnerOrAdminMiddleware {
  constructor(private requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const userId = this.requestService.getUserId();
    const userRole = this.requestService.getUserRole();

    if (
      !userRole.some((role) => role === Roles.admin || role === Roles.coach) &&
      req.params.userId !== userId
    ) {
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
