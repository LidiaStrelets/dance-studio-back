import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@usersModule/users.model';

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  client_id: string;

  @BelongsTo(() => User)
  client: User[];
}
