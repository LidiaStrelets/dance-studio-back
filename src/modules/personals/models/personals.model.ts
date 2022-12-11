import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { TStatus } from '@personalsModule/types/types';

interface PersonalCreationAttrs {
  id: string;
  coach_id: string;
  hall_id?: string;
  class_id: string;
  client_id: string;

  date_time: Date;
  duration: number;
  notes?: string;

  status: TStatus;
}

@Table({ tableName: 'personals' })
export class Personal extends Model<Personal, PersonalCreationAttrs> {
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
  client_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coach_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hall_id?: string;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: TStatus;
}
