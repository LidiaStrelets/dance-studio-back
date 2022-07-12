import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface RegistrationCreationAttrs {
  schedule_id: string;
  client_id: string;
  id: string;
}

@Table({ tableName: 'registrations' })
export class Registration extends Model<
  Registration,
  RegistrationCreationAttrs
> {
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
  schedule_id: string;

  @Column({
    type: DataType.STRING,
  })
  client_id: string;
}
