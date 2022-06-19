import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 1,
    description: 'Unique class identifier',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Stretching',
    description: 'Unique class name',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'This class is...',
    description: 'Describes the class',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @BelongsToMany(() => User, () => UserClasses)
  users: User[];
}
