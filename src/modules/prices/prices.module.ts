import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { PricesController } from '@pricesModule/prices.controller';
import { Price } from '@pricesModule/prices.model';
import { PricesService } from '@pricesModule/prices.service';

@Module({
  controllers: [PricesController],
  providers: [PricesService],
  imports: [SequelizeModule.forFeature([Price]), AuthModule],
  exports: [PricesService],
})
export class PricesModule {}
