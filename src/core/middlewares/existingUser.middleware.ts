import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class ExistingUserMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;

    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new HttpException(
        [
          {
            message: [`Requested user doesn't exist!`],
            problem_field: 'client_id',
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
