import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { DateDataType } from 'sequelize/types';
import { Class } from 'src/modules/classes/classes.model';
import { UserClasses } from 'src/modules/classes/user-classes.model';
import { Payment } from 'src/modules/payments/payments.model';
import { Registration } from 'src/modules/registrations/registrations.model';
import { Role } from 'src/modules/roles/roles.model';
import { UserRoles } from 'src/modules/roles/user-roles.model';

interface UserCreationAttrs {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birth_date: DateDataType | null;
  information: string | null;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

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
