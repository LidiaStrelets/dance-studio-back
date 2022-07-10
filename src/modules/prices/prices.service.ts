import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@pricesModule/dto/add.dto';
import { UpdateDto } from '@pricesModule/dto/update.dto';
import { Price } from '@pricesModule/prices.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  create(dto: CreateDto) {
    const id: string = uuidv4();
    return this.priceRepo.create({ ...dto, id });
  }

  getById(id: string) {
    return this.priceRepo.findByPk(id);
  }

  getAll() {
    return this.priceRepo.findAll();
  }

  async update(data: UpdateDto, id: string) {
    const price = await this.priceRepo.findByPk(id);

    await price.update(data);
    return price;
  }
}
