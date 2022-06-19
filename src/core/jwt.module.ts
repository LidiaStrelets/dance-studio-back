import { Inject, Injectable, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'CoreJwtService',
      useExisting: JwtService,
    },
  ],
  exports: ['CoreJwtService'],
})
export class CoreJwtModule {}
