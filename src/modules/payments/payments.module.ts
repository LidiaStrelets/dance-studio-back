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
import { AdminWithUserIdMiddleware } from '@middlewares/adminWithUserId.middleware';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';
import { Paths } from '@paymentsModule/types/types';

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
    consumer.apply(UnauthorizedMiddleware).forRoutes(Paths.root);

    consumer
      .apply(AdminWithUserIdMiddleware)
      .forRoutes({ path: Paths.root, method: RequestMethod.POST });

    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .exclude({ path: Paths.root, method: RequestMethod.POST })
      .forRoutes(Paths.root);
  }
}
