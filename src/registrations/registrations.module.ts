import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './registrations.model';
import { RegistrationsService } from './registrations.service';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  imports: [
    SequelizeModule.forFeature([User, Registration]),
    AuthModule,
    UsersModule,
    PaymentsModule,
    SchedulesModule,
  ],
})
export class RegistrationsModule {}
