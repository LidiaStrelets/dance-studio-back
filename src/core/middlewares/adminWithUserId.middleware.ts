import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@services/request.service';

@Injectable()
export class AdminWithUserIdMiddleware {
  constructor(private requestService: RequestService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST') {
      next();
      return;
    }
    const userId = req.body.client_id;
    const userRole = this.requestService.getUserRole();

    if (userRole === 'admin' && !userId) {
      throw new HttpException(
        [
          {
            message: ['User idrequired!'],
            problem_field: null,
            name: 'User idis required in admin request',
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
