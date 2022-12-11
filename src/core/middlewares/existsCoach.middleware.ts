import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class ExistsCoachMiddleware {
  constructor(private usersService: UsersService) {}

  async use({ body: { coach_id } }: Request, _, next: NextFunction) {
    const isCoach = await this.usersService.isCoach(coach_id);

    if (!isCoach) {
      throw new HttpException(
        {
          message: `The coach doesn't exist`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
