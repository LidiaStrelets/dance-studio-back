import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { PricesController } from '@pricesModule/controllers/prices.controller';
import { Price } from '@pricesModule/models/prices.model';
import { PricesService } from '@pricesModule/services/prices.service';

@Module({
  controllers: [PricesController],
  providers: [PricesService],
  imports: [SequelizeModule.forFeature([Price]), AuthModule],
  exports: [PricesService],
})
export class PricesModule {}
