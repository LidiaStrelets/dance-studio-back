import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/users.model';
import { Payment } from './payments.model';
import { Price } from 'src/prices/prices.model';
import { PricesModule } from 'src/prices/prices.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [
    SequelizeModule.forFeature([User, Price, Payment]),
    AuthModule,
    PricesModule,
    UsersModule,
  ],
})
export class PaymentsModule {}
