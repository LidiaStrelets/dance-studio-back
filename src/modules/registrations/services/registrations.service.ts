import { BaseFields } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRegistrationDto } from '@registrationsModule/dto/add.dto';
import { Registration } from '@registrationsModule/models/registrations.model';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(Registration) private registrationRepo: typeof Registration,
  ) {}

  public convertMilisecondsToDays = (ms) => ms / 1000 / 60 / 60 / 24;

  public convertMilisecondsToHours = (ms) => ms / 1000 / 60 / 60;

  public create(dto: CreateRegistrationDto): Promise<Registration> {
    return this.registrationRepo.create({
      ...dto,
      ...BaseFields,
    });
  }

  public cancel(id: string): Promise<number> {
    return this.registrationRepo.destroy({
      where: { id },
    });
  }

  public getById(id: string): Promise<Registration> {
    return this.registrationRepo.findByPk(id);
  }

  public findByClientAndSchedule(
    client_id: string,
    schedule_id: string,
  ): Promise<Registration> {
    return this.registrationRepo.findOne({
      where: { client_id, schedule_id },
    });
  }

  public getAllByUser(client_id: string): Promise<Registration[]> {
    return this.registrationRepo.findAll({ where: { client_id } });
  }
}
