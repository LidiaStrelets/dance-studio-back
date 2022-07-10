import { Module } from '@nestjs/common';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { SchedulesController } from '@schedulesModule/controllers/schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { AuthModule } from '@authModule/auth.module';
import { HallsModule } from '@hallsModule/halls.module';
import { UsersModule } from '@usersModule/users.module';

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
