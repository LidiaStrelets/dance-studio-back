import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Hall } from './halls.model';

export interface HallUpdate {
  name?: string;
  description?: string;
}

@Injectable()
export class HallsService {
  constructor(@InjectModel(Hall) private hallRepo: typeof Hall) {}

  async createHall(dto: CreateHallDto) {
    return await this.hallRepo.create(dto);
  }

  async updateHall(data: UpdateHallDto, id: number) {
    const hall = await this.hallRepo.findOne({ where: { id } });

    await hall.update(data);
    return hall;
  }
}
