import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { SchedulesController } from '@schedulesModule/controllers/schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { AuthModule } from '@authModule/auth.module';
import { HallsModule } from '@hallsModule/halls.module';
import { UsersModule } from '@usersModule/users.module';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { RequestService } from '@services/request.service';
import { IsCoachMiddleware } from '@middlewares/isCoach.middleware';
import { ClassesModule } from '@classesModule/classes.module';
import { Path } from '@schedulesModule/types/types';

@Module({
  providers: [SchedulesService, RequestService],
  controllers: [SchedulesController],
  imports: [
    SequelizeModule.forFeature([Schedule]),
    AuthModule,
    HallsModule,
    UsersModule,
    CoreJwtModule,
    ClassesModule,
  ],
  exports: [SchedulesService],
})
export class SchedulesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Path.root);

    consumer.apply(IsCoachMiddleware).exclude(Path.withId).forRoutes(Path.root);
  }
}
