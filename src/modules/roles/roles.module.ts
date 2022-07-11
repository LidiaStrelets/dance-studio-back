import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/models/users.model';
import { RolesController } from '@rolesModule/controllers/roles.controller';
import { Role } from '@rolesModule/models/roles.model';
import { RolesService } from '@rolesModule/services/roles.service';
import { UserRoles } from '@rolesModule/models/user-roles.model';
import { RequestService } from '@services/request.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersModule } from '@usersModule/users.module';
import { ExistsRoleMiddleware } from './middlewares/existsRole.middleware';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RequestService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
    forwardRef(() => AuthModule),
    CoreJwtModule,
    forwardRef(() => UsersModule),
  ],
  exports: [RolesService],
})
export class RolesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('roles');

    consumer.apply(ExistsRoleMiddleware).forRoutes('roles/:id');
  }
}
