import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface PriceCreationAttrs {
  classes_amount: number;
  price: number;
}

@Table({ tableName: 'prices' })
export class Price extends Model<Price, PriceCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  classes_amount: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;
}
