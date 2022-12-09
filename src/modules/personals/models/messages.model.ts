import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface MessageCreationAttrs {
  id: string;
  personal_id: string;
  message: string;
}

@Table({ tableName: 'messages' })
export class Message extends Model<Message, MessageCreationAttrs> {
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
  personal_id: string;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  message: string;
}
