import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@usersModule/users.model';

export function loginMiddleware() {
  return async (req, res, next) => {
    const {
      body: { password, email },
    } = req;

    if (!password || !email) {
      throwError();
    }

    const candidate = await User.findOne({ where: { email } });

    if (!candidate) {
      throwError();
    }

    const isMatch = await bcrypt.compare(password, candidate.password);

    if (!isMatch) {
      throwError();
    }

    next();
  };
}

function throwError() {
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
