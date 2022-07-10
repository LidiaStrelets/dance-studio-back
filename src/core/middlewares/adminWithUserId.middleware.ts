import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@services/request.service';
import { Roles } from '@rolesModule/types';

@Injectable()
export class AdminWithUserIdMiddleware {
  constructor(private requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST') {
      next();
      return;
    }
    const userId = req.body.client_id;
    const userRole = this.requestService.getUserRole();

    if (userRole === Roles.admin && !userId) {
      throw new HttpException(
        [
          {
            message: ['User idrequired!'],
            problem_field: null,
            name: 'User id is required in admin request',
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
