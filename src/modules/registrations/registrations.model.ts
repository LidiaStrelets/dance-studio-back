import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/users.model';

interface RegistrationCreationAttrs {
  schedule_id: number;
  client_id: number;
}

@Table({ tableName: 'registrations' })
export class Registration extends Model<
  Registration,
  RegistrationCreationAttrs
> {
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
  schedule_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  client_id: number;

  @BelongsTo(() => User)
  client: User[];
}
