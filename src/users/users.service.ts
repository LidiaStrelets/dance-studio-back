import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassesService } from 'src/classes/classes.service';
import { AddClassToUserDto } from 'src/classes/dto/add-class-to-user.dto';
import { Role } from 'src/roles/roles.model';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    @InjectModel(Role) private roleRepo: typeof Role,
    private classesService: ClassesService,
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
      return await this.userRepo.findOne({
        where: { id: Number(userId) },
        include: { all: true },
      });
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async addClass(dto: AddClassToUserDto) {
    const user = await this.isUserCoach(dto.user_id);
    if (user) {
      const classObj = this.classesService.getClassById(dto.class);
      await user.$add('class', dto.class);

      return classObj;
    }
  }

  async isUserCoach(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });
    if (!user)
      throw new HttpException(
        `No user found for coach line`,
        HttpStatus.BAD_REQUEST,
      );

    if (!user.roles || !user.roles.some((r) => r.id === 2))
      throw new HttpException(
        `Requested user is not a coach!`,
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }

  async updateUser(data: UpdateUserDto, id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    await user.update(data);
    return user;
  }
}
