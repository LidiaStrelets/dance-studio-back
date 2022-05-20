import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassesService } from 'src/classes/classes.service';
import { AddToUserDto } from 'src/classes/dto/add-to-user.dto';
import { Role } from 'src/roles/roles.model';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    @InjectModel(Role) private roleRepo: typeof Role,
    private classesService: ClassesService,
  ) {}

  async registrate(dto: RegisterDto, roleParam: string) {
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
      const user = await this.userRepo.create(dto);
      await user.$set('roles', [role.id]);
      user.roles = [role];
      return user;
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getAll() {
    return this.userRepo.findAll({ include: { all: true } });
  }

  async getById(userId: string) {
    return this.userRepo.findOne({
      where: { id: Number(userId) },
      include: { all: true },
    });
  }

  async addClass(dto: AddToUserDto) {
    const user = await this.isCoach(dto.user_id);
    if (user) {
      const classObj = await this.classesService.getById(dto.class);
      await user.$add('class', dto.class);

      return classObj;
    }
  }

  async isCoach(id: number) {
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

  async update(data: UpdateDto, id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    await user.update(data);
    return user;
  }
}
