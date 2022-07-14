import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { ClassesService } from '@classesModule/services/classes.service';

@Injectable()
export class ClassAvailableMiddleware {
  constructor(private classesService: ClassesService) {}

  async use(req: Request, _, next: NextFunction) {
    const coachClasses = await this.classesService.getByCoach(req.body.coach);

    if (!coachClasses || coachClasses.length < 1) {
      throw new HttpException(
        `Requested class not found!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}
