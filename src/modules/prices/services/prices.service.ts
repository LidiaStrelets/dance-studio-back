import { BaseFields } from '@core/baseEntity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePriceDto } from '@pricesModule/dto/add.dto';
import { UpdatePriceDto } from '@pricesModule/dto/update.dto';
import { Price } from '@pricesModule/models/prices.model';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  public create(dto: CreatePriceDto): Promise<Price> {
    return this.priceRepo.create({ ...dto, ...BaseFields });
  }

  public getById(id: string): Promise<Price> {
    return this.priceRepo.findByPk(id);
  }

  public getAll(): Promise<Price[]> {
    return this.priceRepo.findAll();
  }

  public update(
    data: UpdatePriceDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.priceRepo.update(data, { where: { id } });
  }
}
