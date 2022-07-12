import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface PaymentCreationAttrs {
  classes_left: number;
  price_id: string;
  client_id: string;
  id: string;
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  classes_left: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  price_id: string;

  @Column({
    type: DataType.STRING,
  })
  client_id: string;
}
