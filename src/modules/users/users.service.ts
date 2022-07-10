import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassesService } from '@classesModule/classes.service';
import { AddToUserDto } from '@classesModule/dto/add-to-user.dto';
import { Role } from '@rolesModule/roles.model';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateDto } from '@usersModule/dto/update.dto';
import { User } from '@usersModule/users.model';
import { v4 as uuidv4 } from 'uuid';
import { Roles as RolesEnum } from '@rolesModule/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private classesService: ClassesService,
  ) {}

  async registrate(dto: RegisterDto, role: Role) {
    const id: string = uuidv4();
    const user = await this.userRepo.create({ ...dto, id });
    await user.$set('roles', [role.id]);

    user.roles = [role];
    return user;
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      include: { all: true },
    });
  }

  getAll() {
    return this.userRepo.findAll({ include: { all: true } });
  }

  getById(id: string) {
    return this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async addClass(dto: AddToUserDto) {
    const userIsCoach = await this.isCoach(dto.user_id);
    if (userIsCoach) {
      const classObj = await this.classesService.getById(dto.class);
      const user = await this.getById(dto.user_id.toString());
      await user.$add('class', dto.class);

      return classObj;
    }
  }

  async isCoach(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });

    return user
      ? user.roles.some((role) => role.title === RolesEnum.coach)
      : false;
  }

  async update(data: UpdateDto, id: string) {
    const user = await this.userRepo.findByPk(id);

    await user.update(data);
    return user;
  }
}
