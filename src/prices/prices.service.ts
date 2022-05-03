import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePriceDto } from './dto/add-price.dto';
import { Price } from './prices.model';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price) private priceRepo: typeof Price) {}

  async createPrice(priceDto: CreatePriceDto) {
    return await this.priceRepo.create(priceDto);
  }

  async getPrices() {
    return await this.priceRepo.findAll();
  }
}
