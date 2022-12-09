import { GetId } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePersonalDto } from '@personalsModule/dto/create.dto';
import { UpdatePersonalDto } from '@personalsModule/dto/update.dto';
import { Personal } from '@personalsModule/models/personals.model';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { Op } from 'sequelize';
import { MessagesService } from './messages.service';

@Injectable()
export class PersonalsService {
  public defaultDuration = 60;
  constructor(
    @InjectModel(Personal) private personalsRepo: typeof Personal,
    private scheduleService: SchedulesService,
    private messagesService: MessagesService,
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
}
