import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@pricesModule/dto/add.dto';
import { UpdateDto } from '@pricesModule/dto/update.dto';
import { Price } from '@pricesModule/models/prices.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  public create(dto: CreateDto): Promise<Price> {
    const id: string = uuidv4();
    return this.priceRepo.create({ ...dto, id });
  }

  public getById(id: string): Promise<Price> {
    return this.priceRepo.findByPk(id);
  }

  public getAll(): Promise<Price[]> {
    return this.priceRepo.findAll();
  }

  public async update(
    data: UpdateDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.priceRepo.update(data, { where: { id } });
  }
}
