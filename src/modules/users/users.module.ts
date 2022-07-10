import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreJwtModule } from '@core/jwt.module';
import { Class } from '@classesModule/models/classes.model';
import { ClassesModule } from '@classesModule/classes.module';
import { UserClasses } from '@classesModule/models/user-classes.model';
import { Payment } from '@paymentsModule/payments.model';
import { Registration } from '@registrationsModule/registrations.model';
import { Role } from '@rolesModule/roles.model';
import { UserRoles } from '@rolesModule/user-roles.model';
import { RolesModule } from '@rolesModule/roles.module';
import { UsersController } from '@usersModule/users.controller';
import { User } from '@usersModule/users.model';
import { UsersService } from '@usersModule/users.service';

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
