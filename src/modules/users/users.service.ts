import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassesService } from 'src/modules/classes/classes.service';
import { AddToUserDto } from 'src/modules/classes/dto/add-to-user.dto';
import { Role } from 'src/modules/roles/roles.model';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './users.model';
import { CreateDto as RoleDto } from './../roles/dto/add.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private classesService: ClassesService,
  ) {}

  async registrate(dto: RegisterDto, role: Role) {
    const user = await this.userRepo.create({ ...dto });
    await user.$set('role', role.id);
    user.role = role;
    return user;
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

  // async addClass(dto: AddToUserDto) {
  //   const user = await this.isCoach(dto.user_id);
  //   if (user) {
  //     const classObj = await this.classesService.getById(dto.class);
  //     await user.$add('class', dto.class);

  //     return classObj;
  //   }
  // }

  // async isCoach(id: number) {
  //   const user = await this.userRepo.findOne({
  //     where: { id },
  //     include: { all: true },
  //   });
  //   if (!user)
  //     throw new HttpException(
  //       `No user found for coach line`,
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   if (!user.roles || !user.roles.some((r) => r.id === 2))
  //     throw new HttpException(
  //       `Requested user is not a coach!`,
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   return user;
  // }

  async update(data: UpdateDto, id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    await user.update(data);
    return user;
  }
}
