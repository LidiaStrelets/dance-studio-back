import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from '@services/request/request.service';
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
import { ExistsRegistrationMiddleware } from './middlewares/existsRegistration.middleware';
import { SpotsAvailableMiddleware } from './middlewares/spotsAvailable.middleware';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';
import { Paths } from '@registrationsModule/types/types';
import { HallsModule } from '@hallsModule/halls.module';
import { ExistsUserMiddleware } from '@middlewares/existsUser.middleware';
import { PaymentAvailableMiddleware } from './middlewares/paymentAvailable.middleware';
import { ClassesModule } from '@classesModule/classes.module';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, RequestService],
  imports: [
    SequelizeModule.forFeature([User, Registration]),
    UsersModule,
    PaymentsModule,
    forwardRef(() => SchedulesModule),
    CoreJwtModule,
    HallsModule,
    ClassesModule,
  ],
  exports: [RegistrationsService],
})
export class RegistrationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Paths.root);

    consumer
      .apply(AdminWithUserIdMiddleware)
      .forRoutes({ path: Paths.root, method: RequestMethod.POST });
    consumer
      .apply(PaymentAvailableMiddleware)
      .forRoutes({ path: Paths.root, method: RequestMethod.POST });
    consumer
      .apply(SpotsAvailableMiddleware)
      .forRoutes({ path: Paths.root, method: RequestMethod.POST });
    consumer
      .apply(ExistsUserMiddleware)
      .forRoutes({ path: Paths.root, method: RequestMethod.POST });
    consumer
      .apply(ExistsRegistrationMiddleware)
      .forRoutes({ path: Paths.root, method: RequestMethod.POST });

    // TODO : check on which routes it is applied
    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .forRoutes({ path: Paths.clientId, method: RequestMethod.GET });
  }
}
