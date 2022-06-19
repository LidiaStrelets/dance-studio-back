import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassesService } from 'src/modules/classes/classes.service';
import { AddToUserDto } from 'src/modules/classes/dto/add-to-user.dto';
import { Role } from 'src/modules/roles/roles.model';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private classesService: ClassesService,
  ) {}

  async registrate(dto: RegisterDto, role: Role) {
    const user = await this.userRepo.create({ ...dto });
    await user.$set('roles', [role.id]);

    user.roles = [role];
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

  async addClass(dto: AddToUserDto) {
    const userIsCoach = await this.isCoach(dto.user_id);
    if (userIsCoach) {
      const classObj = await this.classesService.getById(dto.class);
      const user = await this.getById(dto.user_id.toString());
      await user.$add('class', dto.class);

      return classObj;
    }
  }

  async isCoach(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });

    return user ? user.roles.some((r) => r.id === 2) : false;
  }

  async update(data: UpdateDto, id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    await user.update(data);
    return user;
  }
}
