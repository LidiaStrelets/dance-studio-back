import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '@services/request.service';
import { Roles } from '@core/types';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class AdminWithUserIdMiddleware {
  constructor(
    private requestService: RequestService,
    private userServise: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.user_id || req.body.client_id;
    const userRole = this.requestService.getUserRole();

    if (userRole === Roles.admin) {
      if (!userId) {
        throw new HttpException(
          [
            {
              message: ['User id required!'],
              problem_field: null,
              name: 'User id is required in admin request',
            },
          ],
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userServise.getById(userId);

      if (!user) {
        throw new HttpException(
          [
            {
              message: ['User not found!'],
              problem_field: null,
            },
          ],
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.role !== Roles.client) {
        throw new HttpException(
          { message: 'Registration can be created only for the clients!' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    next();
  }
}
