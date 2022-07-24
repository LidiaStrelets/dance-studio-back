import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { RequestService } from '@services/request.service';
import { Roles } from '@core/types';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class AdminWithUserIdMiddleware {
  constructor(
    private requestService: RequestService,
    private userServise: UsersService,
  ) {}

  private throwException(message: string) {
    throw new HttpException(
      [
        {
          message,
        },
      ],
      HttpStatus.BAD_REQUEST,
    );
  }

  async use(req: Request, _, next: NextFunction) {
    const userId = req.body.user_id || req.body.client_id;
    const userRole = this.requestService.getUserRole();

    if (userRole === Roles.admin) {
      if (!userId) {
        this.throwException('User id required!');
      }

      const user = await this.userServise.getById(userId);

      if (!user) {
        this.throwException('User not found!');
      }

      if (user.role !== Roles.client) {
        this.throwException(
          'Registration can be created only for the clients!',
        );
      }
    }

    next();
  }
}
