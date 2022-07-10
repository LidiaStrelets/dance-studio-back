import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@usersModule/models/users.model';
import { Class } from '@classesModule/models/classes.model';

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
    type: DataType.STRING,
  })
  user_id: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
  })
  class_id: string;
}
