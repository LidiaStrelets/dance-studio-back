import { GetId } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateScheduleDto } from '@schedulesModule/dto/create.dto';
import { UpdateScheduleDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { PLACES_FIELD } from '@schedulesModule/types/types';
import { Op } from 'sequelize';

@Injectable()
export class SchedulesService {
  constructor(@InjectModel(Schedule) private scheduleRepo: typeof Schedule) {}

  public create(dto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleRepo.create({
      ...dto,
      id: GetId(),
    });
  }

  public getById(id: string): Promise<Schedule> {
    return this.scheduleRepo.findByPk(id);
  }

  public get(): Promise<Schedule[]> {
    return this.scheduleRepo.findAll({
      order: [['date_time', 'ASC']],
    });
  }

  public getByTime(date: string): Promise<Schedule[]> {
    const datePart = date.split('T')[0];
    return this.scheduleRepo.findAll({
      where: { date_time: { [Op.like]: `${datePart}%` } },
    });
  }

  public msToMinutes = (ms: number): number => ms / 1000 / 60;

  public update(
    data: UpdateScheduleDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.scheduleRepo.update(data, { where: { id } });
  }
}
