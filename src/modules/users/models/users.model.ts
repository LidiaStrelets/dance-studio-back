import { TRoles } from '@core/types';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttrs {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  birth_date: Date;
  information: string | null;
  photo: string;
  role: TRoles;
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
  birth_date: Date;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  information: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  photo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role: TRoles;
}
