import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from '@classesModule/models/classes.model';
import { CreateDto } from '@classesModule/dto/create.dto';
import { UpdateDto } from '@classesModule/dto/update.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(Class) private classRepo: typeof Class) {}

  public create(dto: CreateDto): Promise<Class> {
    const id: string = uuidv4();
    return this.classRepo.create({ ...dto, id });
  }

  public getById(id: string): Promise<Class> {
    return this.classRepo.findByPk(id);
  }

  public getByCoach(id: string) {
    return this.classRepo.findAll({ where: { coach: id } });
  }

  public async update(
    data: UpdateDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.classRepo.update(data, { where: { id } });
  }
}
