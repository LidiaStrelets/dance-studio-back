import { forwardRef, Module, RequestMethod } from '@nestjs/common';
import { CoreJwtModule } from '@core/jwt.module';
import { UsersModule } from '@usersModule/users.module';
import { RolesModule } from '@rolesModule/roles.module';
import { AuthController } from '@authModule/controllers/auth.controller';
import { AuthService } from '@authModule/services/auth.service';
import {
  LoginModule,
  RegistrationModule,
} from './middlewares/middlewares.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    CoreJwtModule,
    forwardRef(() => RolesModule),
    LoginModule.forRoot({
      forRoutes: [{ path: 'auth/login', method: RequestMethod.POST }],
    }),
    RegistrationModule.forRoot({
      forRoutes: [
        { path: 'auth/registration/:role', method: RequestMethod.POST },
      ],
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
