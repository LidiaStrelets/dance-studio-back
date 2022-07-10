import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HallsService } from '@hallsModule/services/halls.service';

@Injectable()
export class ExistsHallMiddleware {
  constructor(private hallService: HallsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    const hall = await this.hallService.getById(id);

    if (!hall) {
      throw new HttpException(
        { message: 'Hall id is invalid' },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
