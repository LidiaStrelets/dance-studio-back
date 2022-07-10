import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/models/users.model';
import { ClassesController } from '@classesModule/controllers/classes.controller';
import { Class } from '@classesModule/models/classes.model';
import { ClassesService } from '@classesModule/services/classes.service';
import { UserClasses } from '@classesModule/models/user-classes.model';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { RequestService } from '@services/request.service';
import { UsersModule } from '@usersModule/users.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, RequestService],
  imports: [
    SequelizeModule.forFeature([Class, User, UserClasses]),
    AuthModule,
    CoreJwtModule,
    forwardRef(() => UsersModule),
  ],
  exports: [ClassesService],
})
export class ClassesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes('classes');
  }
}
