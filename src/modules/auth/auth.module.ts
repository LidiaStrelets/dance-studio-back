import { forwardRef, Module, RequestMethod } from '@nestjs/common';
import { CoreJwtModule } from 'src/core/jwt.module';
import { UsersModule } from 'src/modules/users/users.module';
import { RolesModule } from '../roles/roles.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
