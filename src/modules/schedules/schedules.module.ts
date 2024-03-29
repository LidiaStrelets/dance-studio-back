import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { SchedulesService } from '@schedulesModule/services/schedules.service';
import { SchedulesController } from '@schedulesModule/controllers/schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from '@schedulesModule/models/schedules.model';
import { AuthModule } from '@authModule/auth.module';
import { HallsModule } from '@hallsModule/halls.module';
import { UsersModule } from '@usersModule/users.module';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { RequestService } from '@services/request/request.service';
import { IsCoachMiddleware } from '@middlewares/isCoach.middleware';
import { ClassesModule } from '@classesModule/classes.module';
import { Path } from '@schedulesModule/types/types';
import { ExistsClassMiddleware } from '@middlewares/existsClass.middleware';
import { ExistsCoachMiddleware } from '@middlewares/existsCoach.middleware';
import { ExistsHallMiddleware } from '@middlewares/existsHall.middleware';
import { RegistrationsModule } from '@registrationsModule/registrations.module';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';
import { PersonalsModule } from '@personalsModule/personals.module';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@Module({
  providers: [SchedulesService, RequestService, UpdateErrorService],
  controllers: [SchedulesController],
  imports: [
    SequelizeModule.forFeature([Schedule]),
    AuthModule,
    HallsModule,
    UsersModule,
    CoreJwtModule,
    ClassesModule,
    forwardRef(() => PersonalsModule),
    forwardRef(() => RegistrationsModule),
  ],
  exports: [SchedulesService],
})
export class SchedulesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Path.root);

    consumer
      .apply(ExistsClassMiddleware)
      .forRoutes(
        { path: Path.root, method: RequestMethod.POST },
        { path: Path.root, method: RequestMethod.PATCH },
      );
    consumer
      .apply(ExistsCoachMiddleware)
      .forRoutes(
        { path: Path.root, method: RequestMethod.POST },
        { path: Path.root, method: RequestMethod.PATCH },
      );
    consumer
      .apply(ExistsHallMiddleware)
      .forRoutes(
        { path: Path.root, method: RequestMethod.POST },
        { path: Path.root, method: RequestMethod.PATCH },
      );

    consumer
      .apply(IsCoachMiddleware)
      .exclude({ path: Path.withId, method: RequestMethod.GET })
      .forRoutes(Path.root);

    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .forRoutes({ path: Path.enrolled, method: RequestMethod.GET });
  }
}
