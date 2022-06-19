import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 1,
    description: 'Unique payment identifier',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 3,
    description:
      'The classes amount left in current pass, if equals to 1000 means that pass is unlimited',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  classes_left: number;

  @ApiProperty({
    example: 1,
    description: 'The unique price identifier',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price_id: number;

  @ApiProperty({
    example: 5,
    description: 'User id',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  client_id: number;

  @BelongsTo(() => User)
  client: User;
}
