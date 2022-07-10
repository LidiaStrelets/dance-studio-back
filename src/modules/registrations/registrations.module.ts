import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from '@services/request.service';
import { PaymentsModule } from '@paymentsModule/payments.module';
import { SchedulesModule } from '@schedulesModule/schedules.module';
import { User } from '@usersModule/models/users.model';
import { UsersModule } from '@usersModule/users.module';
import { RegistrationsController } from '@registrationsModule/controllers/registrations.controller';
import { Registration } from '@registrationsModule/models/registrations.model';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';

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
