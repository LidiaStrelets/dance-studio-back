import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { RequestService } from '@services/request/request.service';
import { UsersService } from '@usersModule/services/users.service';

@Injectable()
export class ExistsUserMiddleware {
  constructor(
    private requestService: RequestService,
    private userServise: UsersService,
  ) {}

  private throwException(message: string) {
    throw new HttpException(
      [
        {
          message,
        },
      ],
      HttpStatus.BAD_REQUEST,
    );
  }

  async use(req: Request, _, next: NextFunction) {
    const userId = req.body.user_id || req.body.client_id;
    const fromToken = this.requestService.getUserId();

    if (userId !== fromToken) {
      this.throwException(`User id doesn't match!`);
    }
    const user = await this.userServise.getById(userId);

    if (!user) {
      this.throwException('User not found!');
    }

    next();
  }
}
