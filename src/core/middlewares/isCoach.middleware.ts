import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@usersModule/users.service';

@Injectable()
export class IsCoachMiddleware {
  constructor(private usersService: UsersService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const userIsCoach = await this.usersService.isCoach(req.body.coach);
    if (!userIsCoach)
      throw new HttpException(
        `Requested user is not a coach`,
        HttpStatus.BAD_REQUEST,
      );
    next();
  }
}
