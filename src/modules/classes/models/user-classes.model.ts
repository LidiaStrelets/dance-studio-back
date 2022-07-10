import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@usersModule/users.model';
import { Class } from '@classesModule/classes.model';

@Table({ tableName: 'user_classes', createdAt: false, updatedAt: false })
export class UserClasses extends Model<UserClasses> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.INTEGER,
  })
  class_id: string;
}
