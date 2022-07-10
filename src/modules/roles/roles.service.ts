import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@rolesModule/dto/add.dto';
import { UpdateDto } from '@rolesModule/dto/update.dto';
import { Role } from '@rolesModule/roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

  async create(dto: CreateDto) {
    return this.roleRepo.create(dto);
  }

  async getByTitle(title: string) {
    return this.roleRepo.findOne({ where: { title } });
  }

  async update(data: UpdateDto, id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });

    await role.update(data);
    return role;
  }
}
