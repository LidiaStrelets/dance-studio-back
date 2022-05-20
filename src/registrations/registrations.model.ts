import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.model';

interface RegistrationCreationAttrs {
  schedule_id: number;
  client_id: number;
}

@Table({ tableName: 'registrations' })
export class Registration extends Model<
  Registration,
  RegistrationCreationAttrs
> {
  @ApiProperty({ example: 1, description: 'Unique registration id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 23,
    description: 'Schedule item id',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  schedule_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  client_id: number;

  @BelongsTo(() => User)
  client: User[];
}