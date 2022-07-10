import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from '@services/request.service';
import { PaymentsModule } from '@paymentsModule/payments.module';
import { SchedulesModule } from '@schedulesModule/schedules.module';
import { User } from '@usersModule/models/users.model';
import { UsersModule } from '@usersModule/users.module';
import { RegistrationsController } from '@registrationsModule/controllers/registrations.controller';
import { Registration } from '@registrationsModule/models/registrations.model';
import { RegistrationsService } from '@registrationsModule/services/registrations.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { AdminWithUserIdMiddleware } from '@middlewares/adminWithUserId.middleware';
import { CoreJwtModule } from '@core/jwt.module';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, RequestService],
  imports: [
    SequelizeModule.forFeature([User, Registration]),
    UsersModule,
    PaymentsModule,
    SchedulesModule,
    CoreJwtModule,
  ],
})
export class RegistrationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('registrations');

    consumer
      .apply(AdminWithUserIdMiddleware)
      .forRoutes({ path: 'registrations', method: RequestMethod.POST });
  }
}
