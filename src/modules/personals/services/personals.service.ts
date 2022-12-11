import { ClassesService } from '@classesModule/services/classes.service';
import { GetId } from '@core/baseEntity';
import { Hall } from '@hallsModule/models/halls.model';
import { HallsService } from '@hallsModule/services/halls.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePersonalDto } from '@personalsModule/dto/create.dto';
import { UpdatePersonalDto } from '@personalsModule/dto/update.dto';
import { Personal } from '@personalsModule/models/personals.model';
import {
  PersonalFullResponce,
  PersonalItem,
} from '@personalsModule/types/types';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { UsersService } from '@usersModule/services/users.service';
import { Op } from 'sequelize';
import { MessagesService } from './messages.service';

@Injectable()
export class PersonalsService {
  public defaultDuration = 60;
  constructor(
    @InjectModel(Personal) private personalsRepo: typeof Personal,
    private scheduleService: SchedulesService,
    private messagesService: MessagesService,
    private userService: UsersService,
    private classService: ClassesService,
    private hallService: HallsService,
  ) {}

  public create(dto: CreatePersonalDto, client_id: string): Promise<Personal> {
    const personal_id = GetId();
    if (dto.message) {
      this.messagesService.create(personal_id, dto.message);
    }
    return this.personalsRepo.create({
      ...dto,
      client_id,
      id: personal_id,
    });
  }

  public update(
    dto: UpdatePersonalDto,
    id: string,
  ): Promise<[affectedCount: number, affectedRows: Personal[]]> {
    const object = {
      hall_id: dto.hall_id,
      status: dto.status,
    };
    if (dto.message) {
      this.messagesService.create(id, dto.message);
    }
    return this.personalsRepo.update(object, {
      where: { id },
      returning: true,
    });
  }

  public getActual(client_id: string) {
    return this.personalsRepo.findAll({
      where: {
        client_id: client_id,
        date_time: { [Op.gt]: new Date() },
      },
    });
  }

  public getByCurrentMonth(coach_id: string): Promise<Personal[]> {
    const maxDate = new Date();
    const minDate = new Date(maxDate.getFullYear(), maxDate.getMonth());

    return this.personalsRepo.findAll({
      where: { date_time: { [Op.lt]: maxDate, [Op.gt]: minDate }, coach_id },
    });
  }

  public getByDate(coach_id: string, date: string): Promise<Personal[]> {
    const minDate = new Date(date);
    const maxDateMs = minDate.getTime() + this.scheduleService.dayToMs(1);
    const maxDate = new Date(maxDateMs);
    return this.personalsRepo.findAll({
      where: {
        date_time: { [Op.lt]: maxDate, [Op.gt]: minDate },
        coach_id,
      },
      order: [['date_time', 'ASC']],
    });
  }

  public getById(id: string): Promise<Personal> {
    return this.personalsRepo.findByPk(id);
  }

  public mapPersonalToResponce = async (
    items: PersonalItem[],
  ): Promise<PersonalFullResponce[]> => {
    const coaches = await this.userService.getCoaches();
    const halls = await this.hallService.get();
    const classes = await this.classService.get();

    return items.map(
      ({
        date_time,
        id,
        duration,
        coach_id,
        hall_id,
        class_id,
        status,
        client_id,
      }) => {
        const {
          firstname,
          lastname,
          id: coachId,
        } = coaches.find((coach) => coach.id === coach_id);
        const {
          id: classId,
          name: className,
          nameUk: classNameUk,
        } = classes.find((class_item) => class_item.id === class_id);

        let hall: Hall;
        if (hall_id) {
          hall = halls.find((hall) => hall.id === hall_id);
        }

        return {
          date_time: date_time,
          id: id,
          duration: duration,
          coach: firstname + ' ' + lastname,
          coach_id: coachId,
          class_id: classId,
          hall: hall?.name,
          class: className,
          hallUk: hall?.nameUk,
          classUk: classNameUk,
          polesAmount: hall?.poles_amount,
          status,
          client_id,
          hall_id,
        };
      },
    );
  };
}
