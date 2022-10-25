import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ScheduleCreationAttrs {
  coach_id: string;
  hall_id: string;
  class_id: string;
  date_time: string;
  duration: number;
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
    type: DataType.STRING,
    allowNull: true,
  })
  date_time: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration: number;
}
