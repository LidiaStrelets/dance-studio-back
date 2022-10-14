import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateHallDto } from '@hallsModule/dto/create.dto';
import { UpdateHallDto } from '@hallsModule/dto/update.dto';
import { Hall } from '@hallsModule/models/halls.model';
import { BaseFields } from '@core/baseEntity';

export interface HallUpdate {
  name?: string;
  description?: string;
}

@Injectable()
export class HallsService {
  constructor(@InjectModel(Hall) private hallRepo: typeof Hall) {}

  public get(): Promise<Hall[]> {
    return this.hallRepo.findAll();
  }

  public create(dto: CreateHallDto): Promise<Hall> {
    return this.hallRepo.create({ ...dto, ...BaseFields });
  }

  public update(
    data: UpdateHallDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.hallRepo.update(data, { where: { id } });
  }

  public async getPolesAmount(id: string): Promise<number> {
    const hall = await this.hallRepo.findByPk(id);

    return hall.poles_amount;
  }

  public getById(id: string): Promise<Hall> {
    return this.hallRepo.findByPk(id);
  }
}
