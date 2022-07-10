import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RolesService } from '@rolesModule/services/roles.service';
import { Roles } from '@rolesModule/types/types';
import { User } from '@usersModule/models/users.model';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RegistrationMiddleware {
  constructor(private rolesService: RolesService) {}

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

    const roleObj = await this.rolesService.getByTitle(role);

    if (!roleObj) {
      throw new HttpException(
        [
          {
            message: ['Role not found!'],
            problem_field: null,
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }

    if (roleObj.title === Roles.admin && !adminKey) {
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
