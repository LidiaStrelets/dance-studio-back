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
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  class: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coach: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hall: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date_time: DateDataType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  places_left: number;
}
