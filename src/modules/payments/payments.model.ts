import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/users.model';

interface PaymentCreationAttrs {
  classes_left: number;
  price: number;
  client_id: number;
}

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment, PaymentCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  classes_left: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  client_id: number;

  @BelongsTo(() => User)
  client: User;
}
