import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ScheduleCreationAttrs {
  id: string;
  coach_id: string;
  hall_id: string;
  class_id: string;

  date_time: Date;
  duration: number;
  notes?: string;
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
  class_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coach_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hall_id: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date_time: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration: number;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  notes: string;
}
