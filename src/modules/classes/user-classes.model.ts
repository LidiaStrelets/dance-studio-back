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
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.INTEGER,
  })
  class_id: number;
}
