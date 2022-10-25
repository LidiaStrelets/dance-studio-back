import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { ClassesService } from '@classesModule/services/classes.service';

@Injectable()
export class ExistsClassMiddleware {
  constructor(private classServise: ClassesService) {}

  async use({ body: { class_id } }: Request, _, next: NextFunction) {
    const classItem = await this.classServise.getById(class_id);

    if (!classItem) {
      throw new HttpException(
        {
          message: `The class doesn't exist`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
