import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface HallCreationAttrs {
  name: string;
  description: string;
  poles_amount: number;
}

@Table({ tableName: 'halls' })
export class Hall extends Model<Hall, HallCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'Unique hall identyfier',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'The big hall',
    description: 'Unique hall name',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'This hall is 60 m^2 squared, includes...',
    description: 'Describes the hall',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({
    example: 9,
    description: 'Poles available for the hall',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  poles_amount: number;
}
