import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@usersModule/models/users.model';
import { UserClasses } from '@classesModule/models/user-classes.model';

interface ClassCreationAttrs {
  name: string;
  description: string;
  id: string;
}

@Table({ tableName: 'classes' })
export class Class extends Model<Class, ClassCreationAttrs> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @BelongsToMany(() => User, () => UserClasses)
  users: User[];
}
