import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface HallCreationAttrs {
  name: string;
  description: string;
  poles_amount: number;
  id: string;
}

@Table({ tableName: 'halls' })
export class Hall extends Model<Hall, HallCreationAttrs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id: string;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  poles_amount: number;
}