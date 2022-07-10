import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@schedulesModule/dto/create.dto';
import { UpdateDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/schedules.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchedulesService {
  constructor(@InjectModel(Schedule) private scheduleRepo: typeof Schedule) {}

  create(dto: CreateDto, availablePoles: number) {
    const id: string = uuidv4();
    return this.scheduleRepo.create({
      ...dto,
      places_left: availablePoles,
      id,
    });
  }

  get(id: string) {
    return this.scheduleRepo.findByPk(id);
  }

  async decreaseAvailableSpots(id: string) {
    const scheduleItem = await this.scheduleRepo.findByPk(id);

    scheduleItem.places_left -= 1;
    await scheduleItem.save();
    return scheduleItem;
  }

  async increaseAvailableSpots(id: string) {
    const scheduleItem = await this.scheduleRepo.findByPk(id);

    scheduleItem.places_left += 1;
    await scheduleItem.save();
    return scheduleItem;
  }

  async update(data: UpdateDto, id: string) {
    const scheduleItem = await this.scheduleRepo.findByPk(id);

    await scheduleItem.update(data);
    return scheduleItem;
  }
}
