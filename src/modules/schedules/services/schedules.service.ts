import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateScheduleDto } from '@schedulesModule/dto/create.dto';
import { UpdateScheduleDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { PLACES_FIELD } from '@schedulesModule/types/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchedulesService {
  constructor(@InjectModel(Schedule) private scheduleRepo: typeof Schedule) {}

  public create(
    dto: CreateScheduleDto,
    places_left: number,
  ): Promise<Schedule> {
    const id: string = uuidv4();
    return this.scheduleRepo.create({
      ...dto,
      places_left,
      id,
    });
  }

  public get(id: string): Promise<Schedule> {
    return this.scheduleRepo.findByPk(id);
  }

  public async decreaseAvailableSpots(id: string): Promise<Schedule> {
    return this.scheduleRepo.decrement(PLACES_FIELD, { by: 1, where: { id } });
  }

  public async increaseAvailableSpots(id: string): Promise<Schedule> {
    return this.scheduleRepo.increment(PLACES_FIELD, { by: 1, where: { id } });
  }

  public async update(
    data: UpdateScheduleDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.scheduleRepo.update(data, { where: { id } });
  }
}
