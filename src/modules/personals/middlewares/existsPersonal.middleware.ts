import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { PersonalsService } from '@personalsModule/services/personals.service';
import { SchedulesService } from '@schedulesModule/services/schedules.service';

@Injectable()
export class ExistsPersonalMiddleware {
  constructor(
    private personalsService: PersonalsService,
    private scheduleService: SchedulesService,
  ) {}

  async use(req: Request, _, next: NextFunction) {
    const items = await this.personalsService.getActual(req.params.userId);

    if (
      items.some(
        (item) =>
          (item.date_time < new Date(req.body.date_time) &&
            new Date(
              item.date_time.getTime() +
                this.scheduleService.minToMs(item.duration),
            ) > new Date(req.body.date_time)) ||
          (item.date_time > new Date(req.body.date_time) &&
            new Date(
              new Date(req.body.date_time).getTime() +
                this.scheduleService.minToMs(req.body.duration),
            ) > item.date_time) ||
          item.date_time.getTime() === new Date(req.body.date_time).getTime(),
      )
    ) {
      throw new HttpException(
        {
          message: `You already requested personal class in the same time`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
