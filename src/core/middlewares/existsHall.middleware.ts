import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { HallsService } from '@hallsModule/services/halls.service';

@Injectable()
export class ExistsHallMiddleware {
  constructor(private hallService: HallsService) {}

  async use({ body: { hall_id } }: Request, _, next: NextFunction) {
    if (!hall_id) {
      next();
      return;
    }

    const hall = await this.hallService.getById(hall_id);

    if (!hall) {
      throw new HttpException(
        {
          message: `The hall doesn't exist`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
