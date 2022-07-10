import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@rolesModule/dto/add.dto';
import { UpdateDto } from '@rolesModule/dto/update.dto';
import { Role } from '@rolesModule/roles.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

  create(dto: CreateDto) {
    const id: string = uuidv4();
    return this.roleRepo.create({ ...dto, id });
  }

  getByTitle(title: string) {
    return this.roleRepo.findOne({ where: { title } });
  }

  async update(data: UpdateDto, id: string) {
    const role = await this.roleRepo.findByPk(id);

    await role.update(data);
    return role;
  }
}
