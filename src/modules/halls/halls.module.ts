import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { HallsController } from '@hallsModule/halls.controller';
import { Hall } from '@hallsModule/halls.model';
import { HallsService } from '@hallsModule/halls.service';

@Module({
  controllers: [HallsController],
  providers: [HallsService],
  imports: [SequelizeModule.forFeature([Hall]), AuthModule],
  exports: [HallsService],
})
export class HallsModule {}