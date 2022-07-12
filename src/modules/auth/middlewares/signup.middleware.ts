import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Roles } from '@core/types';
import { User } from '@usersModule/models/users.model';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RegistrationMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const {
      body: { email, firstname, lastname, password, adminKey, role },
    } = req;

    if (!email || !firstname || !lastname || !password || !role) {
      throw new HttpException(
        [
          {
            message: ['Incorrect credentials!'],
            problem_field: null,
            name: 'Registration Error',
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }

    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw new HttpException(
        [
          {
            message: ['User with this email already exists!'],
            problem_field: 'email',
            name: 'Registration Error',
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      role !== Roles.client &&
      (!adminKey || adminKey !== process.env.ADMIN_KEY)
    ) {
      throw new HttpException(
        [
          {
            message: ['Unauthorized!'],
            problem_field: null,
            name: 'Unauthorized Error',
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
