import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreJwtModule } from '@core/jwt.module';
import { Class } from '@classesModule/models/classes.model';
import { ClassesModule } from '@classesModule/classes.module';
import { UserClasses } from '@classesModule/models/user-classes.model';
import { Payment } from '@paymentsModule/models/payments.model';
import { Registration } from '@registrationsModule/models/registrations.model';
import { Role } from '@rolesModule/models/roles.model';
import { UserRoles } from '@rolesModule/models/user-roles.model';
import { RolesModule } from '@rolesModule/roles.module';
import { UsersController } from '@usersModule/controllers/users.controller';
import { User } from '@usersModule/models/users.model';
import { UsersService } from '@usersModule/services/users.service';
import { RequestService } from '@services/request.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RequestService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Class,
      UserClasses,
      Payment,
      Registration,
    ]),
    ClassesModule,
    CoreJwtModule,
    RolesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('users');

    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .forRoutes(
        { path: 'users/:userId', method: RequestMethod.GET },
        { path: 'users/:userId', method: RequestMethod.PATCH },
      );
  }
}
