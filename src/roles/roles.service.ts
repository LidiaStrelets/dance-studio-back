import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/add-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

  async createRole(roleDto: CreateRoleDto) {
    const role = await this.roleRepo.create(roleDto);
    return role;
  }

  async updateRole(data: UpdateRoleDto, id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });

    await role.update(data);
    return role;
  }
}
