import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/modules/users/users.model';

export function registrationMiddleware() {
  return async (req, res, next) => {
    const {
      body: { email, firstname, lastname, password },
      query: role,
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

    next();
  };
}
