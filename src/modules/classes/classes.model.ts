import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/users.model';
import { UserClasses } from './user-classes.model';

interface ClassCreationAttrs {
  name: string;
  description: string;
}

@Table({ tableName: 'classes' })
export class Class extends Model<Class, ClassCreationAttrs> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @BelongsToMany(() => User, () => UserClasses)
  users: User[];
}
