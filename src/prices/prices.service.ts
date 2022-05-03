import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePriceDto } from './dto/add-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Price } from './prices.model';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  async createPrice(priceDto: CreatePriceDto) {
    return await this.priceRepo.create(priceDto);
  }

  async getPriceById(id: number) {
    return await this.priceRepo.findOne({ where: { id } });
  }

  async getPrices() {
    return await this.priceRepo.findAll();
  }

  async updatePrice(data: UpdatePriceDto, id: number) {
    const price = await this.priceRepo.findOne({ where: { id } });

    await price.update(data);
    return price;
  }
}
