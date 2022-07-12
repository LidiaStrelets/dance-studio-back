import { TRoles } from '@rolesModule/types/types';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { DateDataType } from 'sequelize/types';

interface UserCreationAttrs {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birth_date: DateDataType | null;
  information: string | null;
  id: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birth_date: DateDataType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  information: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role: TRoles;
}
