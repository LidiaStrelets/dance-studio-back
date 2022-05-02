import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { HallsController } from './halls.controller';
import { Hall } from './halls.model';
import { HallsService } from './halls.service';

@Module({
  controllers: [HallsController],
  providers: [HallsService],
  imports: [SequelizeModule.forFeature([Hall]), AuthModule],
})
export class HallsModule {}
