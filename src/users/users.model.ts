import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { DateDataType } from 'sequelize/types';
import { Class } from 'src/classes/classes.model';
import { UserClasses } from 'src/classes/user-classes.model';
import { Payment } from 'src/payments/payments.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

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
  @ApiProperty({
    example: 1,
    description: 'Unique user identifier',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'my-email@gmail.com',
    description: 'Unique user email',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: 'Anna',
    description: 'User name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname: string;

  @ApiProperty({
    example: 'Ivanova',
    description: 'User lastname',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname: string;

  @ApiProperty({
    example: 'qwerty235!',
    description: 'Password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiPropertyOptional({
    example: '29.07.1996',
    description: `User's date of birth`,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birth_date: DateDataType;

  @ApiPropertyOptional({
    example: 'Want to visit classes every day!',
    description: `Here you can attach some additional information about uuser`,
  })
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
}
