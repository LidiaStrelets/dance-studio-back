import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersModule } from '@usersModule/users.module';
import { AuthController } from '@authModule/controllers/auth.controller';
import { AuthService } from '@authModule/services/auth.service';
import { LoginMiddleware } from './middlewares/login.middleware';
import { RegistrationMiddleware } from './middlewares/signup.middleware';
import { Paths } from '@authModule/types/types';
import { HallsModule } from '@hallsModule/halls.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [forwardRef(() => UsersModule), CoreJwtModule],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: Paths.login, method: RequestMethod.POST });

    consumer
      .apply(RegistrationMiddleware)
      .forRoutes({ path: Paths.register, method: RequestMethod.POST });
  }
}
