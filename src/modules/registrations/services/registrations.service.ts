import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@registrationsModule/dto/add.dto';
import { Registration } from '@registrationsModule/models/registrations.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(Registration) private registrationRepo: typeof Registration,
  ) {}

  public convertMilisecondsToDays = (ms) => ms / 1000 / 60 / 60 / 24;

  public convertMilisecondsToHours = (ms) => ms / 1000 / 60 / 60;

  public create(dto: CreateDto, client_id: string): Promise<Registration> {
    const id: string = uuidv4();
    return this.registrationRepo.create({
      ...dto,
      client_id,
      id,
    });
  }

  public cancel(id: string): Promise<number> {
    return this.registrationRepo.destroy({
      where: { id },
    });
  }

  public findById(id: string): Promise<Registration> {
    return this.registrationRepo.findByPk(id);
  }

  public find(userId: string, schId: string): Promise<Registration> {
    return this.registrationRepo.findOne({
      where: { client_id: userId, schedule_id: schId },
    });
  }

  public getAllByUser(id: string): Promise<Registration[]> {
    return this.registrationRepo.findAll({ where: { client_id: id } });
  }
}
