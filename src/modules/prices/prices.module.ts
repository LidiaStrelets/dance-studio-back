import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { PricesController } from '@pricesModule/controllers/prices.controller';
import { Price } from '@pricesModule/models/prices.model';
import { PricesService } from '@pricesModule/services/prices.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { ExistsPriceMiddleware } from '@pricesModule/middlewares/existsPrice.middleware';
import { RequestService } from '@services/request.service';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersModule } from '@usersModule/users.module';

@Module({
  controllers: [PricesController],
  providers: [PricesService, RequestService],
  imports: [
    SequelizeModule.forFeature([Price]),
    AuthModule,
    CoreJwtModule,
    UsersModule,
  ],
  exports: [PricesService],
})
export class PricesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('prices');

    consumer.apply(ExistsPriceMiddleware).forRoutes('prices/:id');
  }
}
