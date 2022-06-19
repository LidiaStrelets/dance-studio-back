import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from './dto/add.dto';
import { UpdateDto } from './dto/update.dto';
import { Price } from './prices.model';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  async create(dto: CreateDto) {
    return this.priceRepo.create(dto);
  }

  async getById(id: number) {
    return this.priceRepo.findOne({ where: { id } });
  }

  async getAll() {
    return this.priceRepo.findAll();
  }

  async update(data: UpdateDto, id: number) {
    const price = await this.priceRepo.findOne({ where: { id } });

    await price.update(data);
    return price;
  }
}
