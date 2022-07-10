import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface PriceCreationAttrs {
  classes_amount: number;
  price: number;
  id: string;
}

@Table({ tableName: 'prices' })
export class Price extends Model<Price, PriceCreationAttrs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id: string;

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
