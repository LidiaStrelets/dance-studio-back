import { TClass, TClassUk } from '@classesModule/types/types';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ClassCreationAttrs {
  name: TClass;
  description: string;
  nameUk: TClassUk;
  descriptionUk: string;
  id: string;
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
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  nameUk: TClassUk;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  descriptionUk: string;
}
