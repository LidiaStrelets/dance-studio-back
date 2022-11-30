import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SERVICE, TOKEN_EXPIROTION } from '@core/constants';
import { SocketService } from './services/socket/socket.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: TOKEN_EXPIROTION },
      }),
    }),
  ],
  providers: [
    {
      provide: JWT_SERVICE,
      useExisting: JwtService,
    },
    SocketService,
  ],
  exports: [JWT_SERVICE],
})
export class CoreJwtModule {}
