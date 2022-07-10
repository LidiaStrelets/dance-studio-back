import { Module } from '@nestjs/common';
import { PaymentsService } from '@paymentsModule/services/payments.service';
import { PaymentsController } from '@paymentsModule/controllers/payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@usersModule/models/users.model';
import { Payment } from '@paymentsModule/models/payments.model';
import { Price } from '@pricesModule/models/prices.model';
import { PricesModule } from '@pricesModule/prices.module';
import { UsersModule } from '@usersModule/users.module';
import { RequestService } from '@services/request.service';

@Module({
  providers: [PaymentsService, RequestService],
  controllers: [PaymentsController],
  imports: [
    SequelizeModule.forFeature([User, Price, Payment]),
    PricesModule,
    UsersModule,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
