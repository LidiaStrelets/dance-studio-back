import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDto } from '@rolesModule/dto/add.dto';
import { UpdateDto } from '@rolesModule/dto/update.dto';
import { Role } from '@rolesModule/roles.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

  public create(dto: CreateDto): Promise<Role> {
    const id: string = uuidv4();
    return this.roleRepo.create({ ...dto, id });
  }

  public getByTitle(title: string): Promise<Role> {
    return this.roleRepo.findOne({ where: { title } });
  }

  public async update(data: UpdateDto, id: string): Promise<Role> {
    const role = await this.roleRepo.findByPk(id);

    await role.update(data);
    return role;
  }
}
