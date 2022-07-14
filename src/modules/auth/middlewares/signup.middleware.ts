import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Roles } from '@core/types';
import { User } from '@usersModule/models/users.model';
import { NextFunction, Request } from 'express';

@Injectable()
export class RegistrationMiddleware {
  async use(
    { body: { email, firstname, lastname, password, adminKey, role } }: Request,
    next: NextFunction,
  ) {
    if (!email || !firstname || !lastname || !password || !role) {
      throw new HttpException(
        [
          {
            message: ['Incorrect credentials!'],
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
            name: 'Unauthorized Error',
          },
        ],
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
