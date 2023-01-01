import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class IsCoachMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, _, next: NextFunction) {
    if (!req.body.coach && !req.body.coach_id) {
      next();
      return;
    }

    const userIsCoach = await this.usersService.isCoach(
      req.body.coach || req.body.coach_id,
    );

    if (!userIsCoach) {
      throw new HttpException(
        `Requested user is not a coach`,
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}
