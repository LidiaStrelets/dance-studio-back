import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface PriceCreationAttrs {
  classes_amount: number;
  price: number;
}

@Table({ tableName: 'prices' })
export class Price extends Model<Price, PriceCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'Unique price identifier',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 8,
    description:
      'The classes amount, if equals to 100 means thas pass is unlimites',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  classes_amount: number;

  @ApiProperty({
    example: 1200.0,
    description: 'The price of classes',
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;
}
