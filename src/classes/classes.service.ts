import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from './classes.model';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(Class) private classRepo: typeof Class) {}

  async createClass(dto: CreateClassDto) {
    return await this.classRepo.create(dto);
  }

  async getClassById(id: number) {
    return await this.classRepo.findOne({ where: { id } });
  }

  async updateClass(data: UpdateClassDto, id: number) {
    const classObj = await this.classRepo.findOne({ where: { id } });

    await classObj.update(data);
    return classObj;
  }
}
