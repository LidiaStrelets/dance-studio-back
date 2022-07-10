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
import { Class } from '@classesModule/classes.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private classesService: ClassesService,
  ) {}

  public async registrate(dto: RegisterDto, role: Role): Promise<User> {
    const id: string = uuidv4();
    const user = await this.userRepo.create({ ...dto, id });
    await user.$set('roles', [role.id]);

    user.roles = [role];
    return user;
  }

  public findByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: { email },
      include: { all: true },
    });
  }

  public getAll(): Promise<User[]> {
    return this.userRepo.findAll({ include: { all: true } });
  }

  public getById(id: string): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });
  }

  public async addClass(dto: AddToUserDto): Promise<Class> {
    const userIsCoach = await this.isCoach(dto.user_id);
    if (userIsCoach) {
      const classObj = await this.classesService.getById(dto.class);
      const user = await this.getById(dto.user_id.toString());
      await user.$add('class', dto.class);

      return classObj;
    }
  }

  public async isCoach(id: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });

    return user.roles.some((role) => role.title === RolesEnum.coach) ?? false;
  }

  public async update(data: UpdateDto, id: string): Promise<User> {
    const user = await this.userRepo.findByPk(id);

    await user.update(data);
    return user;
  }
}
