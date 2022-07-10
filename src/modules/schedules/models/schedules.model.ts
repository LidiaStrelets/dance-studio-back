import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { DateDataType } from 'sequelize/types';

interface ScheduleCreationAttrs {
  coach: string;
  hall: string;
  class: string;
  date_time: DateDataType;
  places_left: number;
  id: string;
}

@Table({ tableName: 'schedules' })
export class Schedule extends Model<Schedule, ScheduleCreationAttrs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coach: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hall: string;

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
