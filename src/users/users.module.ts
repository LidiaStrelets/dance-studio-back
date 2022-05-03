import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Class } from 'src/classes/classes.model';
import { ClassesModule } from 'src/classes/classes.module';
import { UserClasses } from 'src/classes/user-classes.model';
import { Payment } from 'src/payments/payments.model';
import { Registration } from 'src/registrations/registrations.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
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
    AuthModule,
    ClassesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
