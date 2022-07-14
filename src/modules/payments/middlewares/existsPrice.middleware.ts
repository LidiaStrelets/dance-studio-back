import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { PricesService } from '@pricesModule/services/prices.service';

@Injectable()
export class ExistsPriceMiddleware {
  constructor(private priceService: PricesService) {}

  async use(req: Request, _, next: NextFunction) {
    const price = await this.priceService.getById(req.body.price_id);

    if (!price) {
      throw new HttpException(
        { message: 'Price id is invalid', problem_field: 'price_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
