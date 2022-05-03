import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { PricesController } from './prices.controller';
import { Price } from './prices.model';
import { PricesService } from './prices.service';

@Module({
  controllers: [PricesController],
  providers: [PricesService],
  imports: [SequelizeModule.forFeature([Price]), AuthModule],
})
export class PricesModule {}
