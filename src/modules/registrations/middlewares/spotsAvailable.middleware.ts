import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { NO_LEFT } from '@core/constants';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { HallsService } from '@hallsModule/services/halls.service';

@Injectable()
export class SpotsAvailableMiddleware {
  constructor(
    private scheduleService: SchedulesService,
    private registrationsServise: RegistrationsService,
    private hallService: HallsService,
  ) {}

  async use({ body: { schedule_id } }: Request, _, next: NextFunction) {
    const scheduleItem = await this.scheduleService.getById(schedule_id);
    const availableSpots = await this.hallService.getPolesAmount(
      scheduleItem.hall_id,
    );
    const occupiedSpots = await this.registrationsServise.getBySchedule(
      schedule_id,
    );

    if (occupiedSpots.length + 1 > availableSpots) {
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
