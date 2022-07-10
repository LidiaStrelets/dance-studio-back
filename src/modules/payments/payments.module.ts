import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { PaymentsController } from '@paymentsModule/controllers/payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@usersModule/models/users.model';
import { Payment } from '@paymentsModule/models/payments.model';
import { Price } from '@pricesModule/models/prices.model';
import { PricesModule } from '@pricesModule/prices.module';
import { UsersModule } from '@usersModule/users.module';
import { RequestService } from '@services/request.service';
import { ExistsPriceMiddleware } from './middlewares/existsPrice.middleware';
import { AdminWithUserIdMiddleware } from '@middlewares/adminWithUserId.middleware';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { ExistingUserMiddleware } from '@middlewares/existingUser.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';

@Module({
  providers: [PaymentsService, RequestService],
  controllers: [PaymentsController],
  imports: [
    SequelizeModule.forFeature([User, Price, Payment]),
    PricesModule,
    UsersModule,
    CoreJwtModule,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('payments');

    consumer
      .apply(AdminWithUserIdMiddleware)
      .forRoutes({ path: 'payments', method: RequestMethod.POST });

    consumer.apply(ExistingUserMiddleware).forRoutes('payments');

    consumer.apply(DataOwnerOrAdminMiddleware).forRoutes('payments');

    consumer
      .apply(ExistsPriceMiddleware)
      .forRoutes({ path: 'payments', method: RequestMethod.POST });
  }
}
