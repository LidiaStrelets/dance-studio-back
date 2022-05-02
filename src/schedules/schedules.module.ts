import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from './schedules.model';
import { AuthModule } from 'src/auth/auth.module';
import { HallsModule } from 'src/halls/halls.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [SchedulesService],
  controllers: [SchedulesController],
  imports: [
    SequelizeModule.forFeature([Schedule]),
    AuthModule,
    HallsModule,
    UsersModule,
  ],
})
export class SchedulesModule {}
