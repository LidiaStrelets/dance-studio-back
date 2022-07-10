import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from '@services/request.service';
import { PaymentsModule } from '@paymentsModule/payments.module';
import { SchedulesModule } from '@schedulesModule/schedules.module';
import { User } from '@usersModule/users.model';
import { UsersModule } from '@usersModule/users.module';
import { RegistrationsController } from '@registrationsModule/registrations.controller';
import { Registration } from '@registrationsModule/registrations.model';
import { RegistrationsService } from '@registrationsModule/registrations.service';

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
