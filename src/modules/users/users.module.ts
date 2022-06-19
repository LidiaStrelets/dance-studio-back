import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreJwtModule } from 'src/core/jwt.module';
import { Class } from 'src/modules/classes/classes.model';
import { ClassesModule } from 'src/modules/classes/classes.module';
import { UserClasses } from 'src/modules/classes/user-classes.model';
import { Payment } from 'src/modules/payments/payments.model';
import { Registration } from 'src/modules/registrations/registrations.model';
import { Role } from 'src/modules/roles/roles.model';
import { UserRoles } from 'src/modules/roles/user-roles.model';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Class,
      UserClasses,
      Payment,
      Registration,
    ]),
    ClassesModule,
    CoreJwtModule,
    RolesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
