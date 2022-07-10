import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { DateDataType } from 'sequelize/types';
import { Class } from '@classesModule/models/classes.model';
import { UserClasses } from '@classesModule/models/user-classes.model';
import { Payment } from '@paymentsModule/payments.model';
import { Registration } from '@registrationsModule/registrations.model';
import { Role } from '@rolesModule/roles.model';
import { UserRoles } from '@rolesModule/user-roles.model';

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

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @BelongsToMany(() => Class, () => UserClasses)
  classes: Class[];

  @HasMany(() => Payment)
  payments: Payment[];

  @HasMany(() => Registration)
  registrations: Registration[];
}
