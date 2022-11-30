import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { HallsController } from '@hallsModule/controllers/halls.controller';
import { Hall } from '@hallsModule/models/halls.model';
import { HallsService } from '@hallsModule/services/halls.service';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersModule } from '@usersModule/users.module';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { RequestService } from '@services/request/request.service';
import { Paths } from '@hallsModule/types/types';

@Module({
  controllers: [HallsController],
  providers: [HallsService, RequestService],
  imports: [
    SequelizeModule.forFeature([Hall]),
    AuthModule,
    CoreJwtModule,
    UsersModule,
  ],
  exports: [HallsService],
})
export class HallsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Paths.root);
  }
}
