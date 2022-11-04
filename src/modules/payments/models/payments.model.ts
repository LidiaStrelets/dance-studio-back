import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface PaymentCreationAttrs {
  price_id: string;
  user_id: string;
  id: string;
  available_spots: number;
}

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment, PaymentCreationAttrs> {
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
  price_id: string;

  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  available_spots: number;
}
