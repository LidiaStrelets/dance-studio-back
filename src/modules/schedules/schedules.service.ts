import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HallsService } from '@hallsModule/halls.service';
import { UsersService } from '@usersModule/users.service';
import { CreateDto } from '@schedulesModule/dto/create.dto';
import { UpdateDto } from '@schedulesModule/dto/update.dto';
import { Schedule } from '@schedulesModule/schedules.model';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule) private scheduleRepo: typeof Schedule,
    private hallsService: HallsService,
    private userService: UsersService,
  ) {}

  create(dto: CreateDto, availablePoles: number) {
    return this.scheduleRepo.create({
      ...dto,
      places_left: availablePoles,
    });
  }

  get(id: number) {
    return this.scheduleRepo.findOne({ where: { id } });
  }

  async decreaseAvailableSpots(id: number) {
    const scheduleItem = await this.scheduleRepo.findOne({ where: { id } });

    scheduleItem.places_left -= 1;
    await scheduleItem.save();
    return scheduleItem;
  }

  async increaseAvailableSpots(id: number) {
    const scheduleItem = await this.scheduleRepo.findOne({ where: { id } });

    scheduleItem.places_left += 1;
    await scheduleItem.save();
    return scheduleItem;
  }

  async update(data: UpdateDto, id: number) {
    const scheduleItem = await this.scheduleRepo.findOne({ where: { id } });

    await scheduleItem.update(data);
    return scheduleItem;
  }
}
