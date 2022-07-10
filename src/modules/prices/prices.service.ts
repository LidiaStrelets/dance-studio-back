import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@pricesModule/dto/add.dto';
import { UpdateDto } from '@pricesModule/dto/update.dto';
import { Price } from '@pricesModule/prices.model';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  create(dto: CreateDto) {
    return this.priceRepo.create(dto);
  }

  getById(id: number) {
    return this.priceRepo.findOne({ where: { id } });
  }

  getAll() {
    return this.priceRepo.findAll();
  }

  async update(data: UpdateDto, id: number) {
    const price = await this.priceRepo.findOne({ where: { id } });

    await price.update(data);
    return price;
  }
}
