import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/modules/users/users.model';
import { Payment } from './payments.model';
import { Price } from 'src/modules/prices/prices.model';
import { PricesModule } from 'src/modules/prices/prices.module';
import { UsersModule } from 'src/modules/users/users.module';
import { RequestService } from 'src/core/services/request.service';

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
