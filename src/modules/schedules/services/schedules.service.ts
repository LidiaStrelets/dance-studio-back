import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@schedulesModule/dto/create.dto';
import { UpdateDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchedulesService {
  constructor(@InjectModel(Schedule) private scheduleRepo: typeof Schedule) {}

  public create(dto: CreateDto, availablePoles: number): Promise<Schedule> {
    const id: string = uuidv4();
    return this.scheduleRepo.create({
      ...dto,
      places_left: availablePoles,
      id,
    });
  }

  public get(id: string): Promise<Schedule> {
    return this.scheduleRepo.findByPk(id);
  }

  public async decreaseAvailableSpots(id: string): Promise<Schedule> {
    const scheduleItem = await this.scheduleRepo.findByPk(id);

    scheduleItem.places_left -= 1;
    await scheduleItem.save();
    return scheduleItem;
  }

  public async increaseAvailableSpots(id: string): Promise<Schedule> {
    const scheduleItem = await this.scheduleRepo.findByPk(id);

    scheduleItem.places_left += 1;
    await scheduleItem.save();
    return scheduleItem;
  }

  public async update(data: UpdateDto, id: string): Promise<Schedule> {
    const scheduleItem = await this.scheduleRepo.findByPk(id);

    await scheduleItem.update(data);
    return scheduleItem;
  }
}
