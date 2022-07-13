import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@usersModule/models/users.model';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoginMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const {
      body: { password, email },
    } = req;

    if (!password || !email) {
      this.throwError();
    }

    const candidate = await User.findOne({ where: { email } });

    if (!candidate) {
      this.throwError();
    }

    const isMatch = await bcrypt.compare(password, candidate.password);

    if (!isMatch) {
      this.throwError();
    }

    next();
  }

  private throwError() {
    throw new HttpException(
      [
        {
          message: ['Incorrect credentials!'],
          problem_field: null,
          name: 'Login Error',
        },
      ],
      HttpStatus.BAD_REQUEST,
    );
  }
}
