import { TRoles } from '@rolesModule/types/types';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface RoleCreationAttrs {
  title: TRoles;
  description: string;
  id: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: TRoles;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;
}
