import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PricesService } from '@pricesModule/services/prices.service';

@Injectable()
export class ExistsPriceMiddleware {
  constructor(private priceService: PricesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const price = await this.priceService.getById(req.params.id);

    if (!price) {
      throw new HttpException(
        { message: 'Price id is invalid', problem_field: 'price_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
