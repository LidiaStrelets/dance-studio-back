import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersController } from '@usersModule/controllers/users.controller';
import { User } from '@usersModule/models/users.model';
import { UsersService } from '@usersModule/services/users.service';
import { RequestService } from '@services/request/request.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';
import { Path } from '@usersModule/types/types';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RequestService],
  imports: [SequelizeModule.forFeature([User]), CoreJwtModule],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Path.root);

    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .forRoutes({ path: Path.withId, method: RequestMethod.PATCH });
  }
}
