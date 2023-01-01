import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from '@classesModule/models/classes.model';
import { CreateClassDto } from '@classesModule/dto/create.dto';
import { UpdateClassDto } from '@classesModule/dto/update.dto';
import { GetId } from '@core/baseEntity';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(Class) private classRepo: typeof Class) {}

  public create(dto: CreateClassDto): Promise<Class> {
    return this.classRepo.create({ ...dto, id: GetId() });
  }

  public getById(id: string): Promise<Class> {
    return this.classRepo.findByPk(id);
  }

  public get(): Promise<Class[]> {
    return this.classRepo.findAll();
  }

  public update(
    data: UpdateClassDto,
    id: string,
  ): Promise<[affectedCount: number, affectedRows: Class[]]> {
    return this.classRepo.update(data, { where: { id }, returning: true });
  }
}
