import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/roles.model';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    @InjectModel(Role) private roleRepo: typeof Role,
  ) {}

  async registrateUser(userDto: RegisterUserDto, roleParam: string) {
    const role = await this.roleRepo.findOne({ where: { title: roleParam } });
    if (!role) {
      throw new HttpException(
        {
          message: `Impossible to register user with a role ${roleParam}. Role ${roleParam} doesn't exist!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.userRepo.create(userDto);
      await user.$set('roles', [role.id]);
      user.roles = [role];
      return user;
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getUsers() {
    return await this.userRepo.findAll({ include: { all: true } });
  }

  async getUser(userId: string) {
    try {
      return await this.userRepo.findOne({ where: { id: Number(userId) } });
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }
}
