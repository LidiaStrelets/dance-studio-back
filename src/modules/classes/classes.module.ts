import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/models/users.model';
import { ClassesController } from '@classesModule/controllers/classes.controller';
import { Class } from '@classesModule/models/classes.model';
import { ClassesService } from '@classesModule/services/classes.service';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { CoreJwtModule } from '@core/jwt.module';
import { RequestService } from '@services/request/request.service';
import { UsersModule } from '@usersModule/users.module';
import { Paths } from '@classesModule/types/types';
import { UpdateErrorService } from '@services/updateError/update-error.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, RequestService, UpdateErrorService],
  imports: [
    SequelizeModule.forFeature([Class, User]),
    AuthModule,
    CoreJwtModule,
    forwardRef(() => UsersModule),
  ],
  exports: [ClassesService],
})
export class ClassesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UnauthorizedMiddleware).forRoutes(Paths.root);
  }
}
