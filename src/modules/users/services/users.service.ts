import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { UpdateUserDto } from '@usersModule/dto/update.dto';
import { User } from '@usersModule/models/users.model';
import { Roles as RolesEnum } from '@core/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';
import { BaseFields } from '@core/baseEntity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepo: typeof User) {}

  public registrate(dto: RegisterDto): Promise<User> {
    return this.userRepo.create({ ...dto, ...BaseFields });
  }

  public updateRole({ role, userId: id }: UpdateRoleDto) {
    return this.userRepo.update({ role }, { where: { id } });
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    console.log('USER', user);

    return this.userRepo.findOne({
      where: { email },
    });
  }

  public getAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  public getById(id: string): Promise<User> {
    return this.userRepo.findByPk(id);
  }

  public async isCoach(id: string): Promise<boolean> {
    const user = await this.userRepo.findByPk(id);

    return user.role === RolesEnum.coach;
  }

  public update(
    data: UpdateUserDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.userRepo.update(data, { where: { id } });
  }
}
