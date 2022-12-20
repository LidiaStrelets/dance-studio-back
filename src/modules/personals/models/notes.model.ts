import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface NotesCreationAttrs {
  id: string;
  class_id: string;
  notes: string;
}

@Table({ tableName: 'notes' })
export class Notes extends Model<Notes, NotesCreationAttrs> {
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
  class_id: string;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  notes: string;
}
