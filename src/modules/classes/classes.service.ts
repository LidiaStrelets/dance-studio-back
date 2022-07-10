import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from '@classesModule/classes.model';
import { CreateDto } from '@classesModule/dto/create.dto';
import { UpdateDto } from '@classesModule/dto/update.dto';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(Class) private classRepo: typeof Class) {}

  create(dto: CreateDto) {
    return this.classRepo.create(dto);
  }

  getById(id: number) {
    return this.classRepo.findOne({ where: { id } });
  }

  async update(data: UpdateDto, id: number) {
    const classObj = await this.classRepo.findOne({ where: { id } });

    await classObj.update(data);
    return classObj;
  }
}
