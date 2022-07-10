import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@registrationsModule/dto/add.dto';
import { Registration } from '@registrationsModule/registrations.model';

export const convertMilisecondsToDays = (ms) => ms / 1000 / 60 / 60 / 24;
export const convertMilisecondsToHours = (ms) => ms / 1000 / 60 / 60;

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(Registration) private registrationRepo: typeof Registration,
  ) {}

  create(dto: CreateDto, client_id: number) {
    return this.registrationRepo.create({
      ...dto,
      client_id,
    });
  }

  cancel(id: string) {
    return this.registrationRepo.destroy({
      where: { id },
    });
  }

  findById(regId: string) {
    return this.registrationRepo.findOne({
      where: { id: regId },
    });
  }

  find(userId: number, schId: number) {
    return this.registrationRepo.findOne({
      where: { client_id: userId, schedule_id: schId },
    });
  }

  getAllByUser(id: number) {
    return this.registrationRepo.findAll({ where: { client_id: id } });
  }
}
