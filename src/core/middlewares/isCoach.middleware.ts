import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class IsCoachMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.body.coach) {
      next();
      return;
    }

    const userIsCoach = await this.usersService.isCoach(req.body.coach);
    if (!userIsCoach) {
      throw new HttpException(
        `Requested user is not a coach`,
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
