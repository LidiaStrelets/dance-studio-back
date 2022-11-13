import { ClassesService } from '@classesModule/services/classes.service';
import { GetId } from '@core/baseEntity';
import { HallsService } from '@hallsModule/services/halls.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateScheduleDto } from '@schedulesModule/dto/create.dto';
import { UpdateScheduleDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { FullResponce, SingleFullResponce } from '@schedulesModule/types/types';
import { UsersService } from '@usersModule/services/users.service';
import { Op } from 'sequelize';

@Injectable()
export class SchedulesService {
  public defaultDuration = 60;
  constructor(
    @InjectModel(Schedule) private scheduleRepo: typeof Schedule,
    private usersServise: UsersService,
    private hallService: HallsService,
    private classService: ClassesService,
  ) {}

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

  public getForPeriod(dateFrom: string, dateTo: string): Promise<Schedule[]> {
    const minDate = new Date(dateFrom);
    const maxDate = new Date(dateTo);
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

  public mapSchedulesToResponce = async (
    schedulesItems: Schedule[],
  ): Promise<FullResponce[]> => {
    const coaches = await this.usersServise.getCoaches();
    const halls = await this.hallService.get();
    const classes = await this.classService.get();

    return schedulesItems.map((item) => {
      const coach = coaches.find((coach) => coach.id === item.coach_id);
      return {
        date_time: item.date_time,
        id: item.id,
        duration: item.duration,
        coach: coach.firstname + ' ' + coach.lastname,
        coach_id: coach.id,
        class_id: classes.find((class_item) => class_item.id === item.class_id)
          .id,
        hall: halls.find((hall) => hall.id === item.hall_id).name,
        class: classes.find((class_item) => class_item.id === item.class_id)
          .name,
        hallUk: halls.find((hall) => hall.id === item.hall_id).nameUk,
        classUk: classes.find((class_item) => class_item.id === item.class_id)
          .nameUk,
        polesAmount: halls.find((hall) => hall.id === item.hall_id)
          .poles_amount,
      };
    });
  };

  public mapScheduleToResponce = async ({
    date_time,
    id,
    duration,
    coach_id,
    hall_id,
    class_id,
  }: Schedule): Promise<SingleFullResponce> => {
    const coaches = await this.usersServise.getCoaches();
    const halls = await this.hallService.get();
    const classes = await this.classService.get();
    const {
      firstname,
      lastname,
      information,
      id: coachId,
    } = coaches.find((coach) => coach.id === coach_id);
    const { name, nameUk, poles_amount } = halls.find(
      (hall) => hall.id === hall_id,
    );
    const {
      id: classId,
      name: className,
      nameUk: classNameUk,
      description,
      descriptionUk,
    } = classes.find((class_item) => class_item.id === class_id);
    return {
      date_time: date_time,
      id: id,
      duration: duration,
      coach: firstname + ' ' + lastname,
      coach_id: coachId,
      class_id: classId,
      hall: name,
      class: className,
      hallUk: nameUk,
      classUk: classNameUk,
      polesAmount: poles_amount,
      classInfo: description,
      classInfoUk: descriptionUk,
      coachInfo: information,
    };
  };
}
