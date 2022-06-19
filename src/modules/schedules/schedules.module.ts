import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from './schedules.model';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HallsModule } from 'src/modules/halls/halls.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  providers: [SchedulesService],
  controllers: [SchedulesController],
  imports: [
    SequelizeModule.forFeature([Schedule]),
    AuthModule,
    HallsModule,
    UsersModule,
  ],
  exports: [SchedulesService],
})
export class SchedulesModule {}
