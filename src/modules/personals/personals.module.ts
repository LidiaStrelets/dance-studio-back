import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from '@services/request/request.service';
import { PersonalsController } from '@personalsModule/controllers/personals.controller';
import { Personal } from '@personalsModule/models/personals.model';
import { PersonalsService } from '@personalsModule/services/personals.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { Path } from '@personalsModule/types/types';
import { ExistsClassMiddleware } from '@middlewares/existsClass.middleware';
import { ExistsCoachMiddleware } from '@middlewares/existsCoach.middleware';
import { ExistsHallMiddleware } from '@middlewares/existsHall.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersModule } from '@usersModule/users.module';
import { HallsModule } from '@hallsModule/halls.module';
import { ClassesModule } from '@classesModule/classes.module';
import { SchedulesModule } from '@schedulesModule/schedules.module';
import { ExistsPersonalMiddleware } from './middlewares/existsPersonal.middleware';
import { IsCoachIdMiddleware } from './middlewares/isCoachId.middleware';
import { UpdateErrorService } from '@services/updateError/update-error.service';
import { Message } from './models/messages.model';
import { MessagesService } from './services/messages.service';

@Module({
  providers: [
    PersonalsService,
    RequestService,
    UpdateErrorService,
    MessagesService,
  ],
  controllers: [PersonalsController],
  imports: [
    SequelizeModule.forFeature([Personal, Message]),
    HallsModule,
    UsersModule,
    CoreJwtModule,
    ClassesModule,
    forwardRef(() => SchedulesModule),
  ],
  exports: [PersonalsService, MessagesService],
})
export class PersonalsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Path.root);

    consumer
      .apply(ExistsClassMiddleware)
      .forRoutes({ path: Path.root, method: RequestMethod.POST });
    consumer
      .apply(ExistsCoachMiddleware)
      .forRoutes({ path: Path.root, method: RequestMethod.POST });
    consumer
      .apply(ExistsHallMiddleware)
      .forRoutes({ path: Path.root, method: RequestMethod.POST });

    consumer
      .apply(ExistsPersonalMiddleware)
      .forRoutes({ path: Path.withId, method: RequestMethod.POST });

    consumer
      .apply(IsCoachIdMiddleware)
      .forRoutes({ path: Path.coach, method: RequestMethod.GET });
  }
}
