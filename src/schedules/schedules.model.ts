import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { DateDataType } from 'sequelize/types';

interface ScheduleCreationAttrs {
  coach: number;
  hall: number;
  class: number;
  date_time: DateDataType;
  places_left: number;
}

@Table({ tableName: 'schedules' })
export class Schedule extends Model<Schedule, ScheduleCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'Unique schedule position identyfier',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Unique class identyfier',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  class: number;

  @ApiProperty({
    example: 1,
    description: 'Unique coach identyfier',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coach: number;

  @ApiProperty({
    example: 1,
    description: 'Unique hall identyfier',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hall: number;

  @ApiProperty({
    example: '29.07.2022',
    description: `Class date and time`,
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date_time: DateDataType;

  @ApiProperty({
    example: 3,
    description: 'Available poles for current class',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  places_left: number;
}
