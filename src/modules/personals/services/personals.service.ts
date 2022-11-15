import { GetId } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePersonalDto } from '@personalsModule/dto/create.dto';
import { Personal } from '@personalsModule/models/personals.model';
import { Op } from 'sequelize';

@Injectable()
export class PersonalsService {
  public defaultDuration = 60;
  constructor(@InjectModel(Personal) private personalsRepo: typeof Personal) {}

  public create(dto: CreatePersonalDto, client_id: string): Promise<Personal> {
    return this.personalsRepo.create({
      ...dto,
      client_id,
      id: GetId(),
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
}
