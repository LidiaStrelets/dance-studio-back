import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from 'src/core/services/request.service';
import { PaymentsModule } from 'src/modules/payments/payments.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import { User } from 'src/modules/users/users.model';
import { UsersModule } from 'src/modules/users/users.module';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './registrations.model';
import { RegistrationsService } from './registrations.service';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, RequestService],
  imports: [
    SequelizeModule.forFeature([User, Registration]),
    UsersModule,
    PaymentsModule,
    SchedulesModule,
  ],
})
export class RegistrationsModule {}
