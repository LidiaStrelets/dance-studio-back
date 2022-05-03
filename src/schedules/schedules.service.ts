import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HallsService } from 'src/halls/halls.service';
import { UsersService } from 'src/users/users.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schedules.model';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule) private scheduleRepo: typeof Schedule,
    private hallsService: HallsService,
    private userService: UsersService,
  ) {}

  async createScheduleItem(dto: CreateScheduleDto) {
    try {
      const user = await this.userService.isUserCoach(dto.coach);
      if (user) {
        if (!user.classes.some((cl) => cl.id === dto.class))
          throw new HttpException(
            `${user.firstname} ${user.lastname} doesn't conduct requested class!`,
            HttpStatus.BAD_REQUEST,
          );
        const availablePoles = await this.hallsService.getPolesAmount(dto.hall);
        return await this.scheduleRepo.create({
          ...dto,
          places_left: availablePoles,
        });
      }
    } catch (e) {
      throw new HttpException(
        `Something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getScheduleItem(id: number) {
    return await this.scheduleRepo.findOne({ where: { id } });
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

  async updateScheduleItem(data: UpdateScheduleDto, id: number) {
    const scheduleItem = await this.scheduleRepo.findOne({ where: { id } });

    await scheduleItem.update(data);
    return scheduleItem;
  }
}
