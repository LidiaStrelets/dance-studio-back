import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { NO_LEFT } from '@core/constants';

@Injectable()
export class SpotsAvailableMiddleware {
  constructor(private scheduleService: SchedulesService) {}

  async use({ body: { schedule_id } }: Request, _, next: NextFunction) {
    const scheduleItem = await this.scheduleService.getById(schedule_id);

    if (scheduleItem.places_left === NO_LEFT) {
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
