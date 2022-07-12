import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateDto } from '@usersModule/dto/update.dto';
import { User } from '@usersModule/models/users.model';
import { v4 as uuidv4 } from 'uuid';
import { Roles as RolesEnum } from '@core/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepo: typeof User) {}

  public async registrate(dto: RegisterDto): Promise<User> {
    const id: string = uuidv4();
    const user = await this.userRepo.create({ ...dto, id });

    user.role = dto.role;
    return user;
  }

  public async updateRole(dto: UpdateRoleDto) {
    const user = await this.userRepo.findByPk(dto.userId);

    user.role = dto.role;
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

  public async isCoach(id: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id },
      include: { all: true },
    });

    return user.role === RolesEnum.coach ?? false;
  }

  public async update(data: UpdateDto, id: string): Promise<User> {
    const user = await this.userRepo.findByPk(id);
    if (!user) {
      return null;
    }

    await user.update(data);
    return user;
  }
}
