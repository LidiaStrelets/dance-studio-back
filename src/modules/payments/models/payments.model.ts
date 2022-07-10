import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@usersModule/users.model';

interface PaymentCreationAttrs {
  classes_left: number;
  price: number;
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  client_id: string;

  @BelongsTo(() => User)
  client: User;
}
