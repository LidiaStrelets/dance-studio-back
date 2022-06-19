import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from './classes.model';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(Class) private classRepo: typeof Class) {}

  async create(dto: CreateDto) {
    return this.classRepo.create(dto);
  }

  async getById(id: number) {
    return this.classRepo.findOne({ where: { id } });
  }

  async update(data: UpdateDto, id: number) {
    const classObj = await this.classRepo.findOne({ where: { id } });

    await classObj.update(data);
    return classObj;
  }
}
