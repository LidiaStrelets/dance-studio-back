import { TClass } from '@classesModule/types/types';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ClassCreationAttrs {
  name: TClass;
  description: string;
  id: string;
  coach: string;
}

@Table({ tableName: 'classes' })
export class Class extends Model<Class, ClassCreationAttrs> {
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
  name: TClass;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coach: string;
}
