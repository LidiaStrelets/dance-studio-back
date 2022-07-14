import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { SchedulesService } from '@schedulesModule/services/schedules.service';

@Injectable()
export class SpotsAvailableMiddleware {
  constructor(private scheduleService: SchedulesService) {}

  async use({ body: { schedule_id } }: Request, _, next: NextFunction) {
    const scheduleItem = await this.scheduleService.get(schedule_id);

    if (scheduleItem.places_left === 0) {
      throw new HttpException(
        {
          message: 'No places left for this class, try another one!',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    next();
  }
}
