import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@hallsModule/dto/create.dto';
import { UpdateDto } from '@hallsModule/dto/update.dto';
import { Hall } from '@hallsModule/halls.model';
import { v4 as uuidv4 } from 'uuid';

export interface HallUpdate {
  name?: string;
  description?: string;
}

@Injectable()
export class HallsService {
  constructor(@InjectModel(Hall) private hallRepo: typeof Hall) {}

  create(dto: CreateDto) {
    const id: string = uuidv4();
    return this.hallRepo.create({ ...dto, id });
  }

  async update(data: UpdateDto, id: string) {
    const hall = await this.hallRepo.findByPk(id);

    await hall.update(data);
    return hall;
  }

  async getPolesAmount(id: string) {
    const hall = await this.hallRepo.findByPk(id);

    return hall.poles_amount;
  }
}
