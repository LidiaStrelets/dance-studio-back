import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class ClassAvailableMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.usersService.getById(req.body.coach);

    if (!user.classes.some((userClass) => userClass.id === req.body.class)) {
      throw new HttpException(
        `${user.firstname} ${user.lastname} doesn't give requested class!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}
