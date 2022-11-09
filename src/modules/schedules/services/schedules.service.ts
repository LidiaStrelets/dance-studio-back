import { GetId } from '@core/baseEntity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateScheduleDto } from '@schedulesModule/dto/create.dto';
import { UpdateScheduleDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { Op } from 'sequelize';

@Injectable()
export class SchedulesService {
  public defaultDuration = 60;
  constructor(@InjectModel(Schedule) private scheduleRepo: typeof Schedule) {}

  public create(dto: CreateScheduleDto): Promise<Schedule> {
    const date_time_str = dto.date_time;
    const date_time = new Date(date_time_str);
    return this.scheduleRepo.create({
      ...dto,
      date_time,
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

  // public getByTime(date: string): Promise<Schedule[]> {
  //   const datePart = date.split('T')[0];
  //   return this.scheduleRepo.findAll({
  //     where: { date_time: { [Op.like]: `${datePart}%` } },
  //   });
  // }

  public checkSameTime(dto: CreateScheduleDto): Promise<Schedule[]> {
    const minDateMs =
      new Date(dto.date_time).getTime() - this.minToMs(this.defaultDuration);
    const maxDateMs =
      new Date(dto.date_time).getTime() + this.minToMs(dto.duration);

    const minDate = new Date(minDateMs);
    const maxDate = new Date(maxDateMs);
    return this.scheduleRepo.findAll({
      where: { date_time: { [Op.lt]: maxDate, [Op.gt]: minDate } },
    });
  }

  public getByDate(date: string): Promise<Schedule[]> {
    const minDate = new Date(date);
    const maxDateMs = minDate.getTime() + this.dayToMs(1);
    const maxDate = new Date(maxDateMs);
    return this.scheduleRepo.findAll({
      where: { date_time: { [Op.lt]: maxDate, [Op.gt]: minDate } },
    });
  }

  public getByDuration(date: string): Promise<Schedule[]> {
    const dateStr = date.split('T')[0];
    const minDate = new Date(dateStr);
    const maxDate = new Date(minDate.getTime() + this.dayToMs(1));
    return this.scheduleRepo.findAll({
      where: {
        date_time: { [Op.lt]: maxDate, [Op.gt]: minDate },
        duration: { [Op.ne]: this.defaultDuration },
      },
      order: [['date_time', 'DESC']],
    });
  }

  public msToMinutes = (ms: number): number => ms / 1000 / 60;
  public minToMs = (min: number): number => min * 60 * 1000;
  public dayToMs = (day: number): number => day * 24 * 60 * 60 * 1000;

  public throwSameTimeException = () => {
    throw new HttpException(
      [
        {
          message: [
            'You are trying to create class in the same time with esisting one',
          ],
        },
      ],
      HttpStatus.BAD_REQUEST,
    );
  };

  public update(
    data: UpdateScheduleDto,
    id: string,
  ): Promise<[affectedCount: number, affectedRows: Schedule[]]> {
    const date_time_str = data.date_time;
    const date_time = new Date(date_time_str);
    return this.scheduleRepo.update(
      { ...data, date_time },
      { where: { id }, returning: true },
    );
  }
}
