import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreJwtModule } from '@core/jwt.module';
import { Class } from '@classesModule/models/classes.model';
import { ClassesModule } from '@classesModule/classes.module';
import { Payment } from '@paymentsModule/models/payments.model';
import { Registration } from '@registrationsModule/models/registrations.model';
import { UsersController } from '@usersModule/controllers/users.controller';
import { User } from '@usersModule/models/users.model';
import { UsersService } from '@usersModule/services/users.service';
import { RequestService } from '@services/request.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';
import { Path } from '@usersModule/types/types';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RequestService],
  imports: [
    SequelizeModule.forFeature([User, Class, Payment, Registration]),
    ClassesModule,
    CoreJwtModule,
  ],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('*');

    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .forRoutes(
        { path: Path.withId, method: RequestMethod.GET },
        { path: Path.withId, method: RequestMethod.PATCH },
      );
  }
}
