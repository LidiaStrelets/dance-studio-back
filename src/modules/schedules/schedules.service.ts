import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HallsService } from 'src/modules/halls/halls.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Schedule } from './schedules.model';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule) private scheduleRepo: typeof Schedule,
    private hallsService: HallsService,
    private userService: UsersService,
  ) {}

  // async create(dto: CreateDto) {
  //   try {
  //     // const user = await this.userService.isCoach(dto.coach);
  //     if (user) {
  //       if (!user.classes.some((cl) => cl.id === dto.class))
  //         throw new HttpException(
  //           `${user.firstname} ${user.lastname} doesn't conduct requested class!`,
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       const availablePoles = await this.hallsService.getPolesAmount(dto.hall);
  //       return this.scheduleRepo.create({
  //         ...dto,
  //         places_left: availablePoles,
  //       });
  //     }
  //   } catch (e) {
  //     throw new HttpException(
  //       `Something went wrong`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async get(id: number) {
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
