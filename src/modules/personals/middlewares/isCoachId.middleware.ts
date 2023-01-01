import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { UsersService } from '@usersModule/services/users.service';
import { Roles } from '@core/types';

@Injectable()
export class IsCoachIdMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, _, next: NextFunction) {
    const user = await this.usersService.getById(req.params.coachId);

    if (user.role !== Roles.coach) {
      throw new HttpException(
        {
          message: `You are trying to get coach information for not coach user`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    next();
  }
}
