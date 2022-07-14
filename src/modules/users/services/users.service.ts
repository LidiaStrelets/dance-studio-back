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

    return this.userRepo.create({ ...dto, id });
  }

  public async updateRole({ role, userId: id }: UpdateRoleDto) {
    return this.userRepo.update({ role }, { where: { id } });
  }

  public findByEmail(email: string): Promise<User> {
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

  public async update(
    data: UpdateDto,
    id: string,
  ): Promise<[affectedCount: number]> {
    return this.userRepo.update(data, { where: { id } });
  }
}
