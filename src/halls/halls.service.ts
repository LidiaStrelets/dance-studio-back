import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Hall } from './halls.model';

export interface HallUpdate {
  name?: string;
  description?: string;
}

@Injectable()
export class HallsService {
  constructor(@InjectModel(Hall) private hallRepo: typeof Hall) {}

  async create(dto: CreateDto) {
    return this.hallRepo.create(dto);
  }

  async update(data: UpdateDto, id: number) {
    const hall = await this.hallRepo.findOne({ where: { id } });

    await hall.update(data);
    return hall;
  }

  async getPolesAmount(id: number) {
    const hall = await this.hallRepo.findOne({ where: { id } });

    return hall.poles_amount;
  }
}
