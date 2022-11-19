import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@usersModule/users.module';
import { AuthModule } from '@authModule/auth.module';
import { HallsModule } from '@hallsModule/halls.module';
import { ClassesModule } from '@classesModule/classes.module';
import { SchedulesModule } from '@schedulesModule/schedules.module';
import { PricesModule } from '@pricesModule/prices.module';
import { PaymentsModule } from '@paymentsModule/payments.module';
import { RegistrationsModule } from '@registrationsModule/registrations.module';
import { CoreJwtModule } from '@core/jwt.module';
import { RequestService } from '@services/request.service';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { PersonalsModule } from '@personalsModule/personals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false, // This line will fix new error
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
    UsersModule,
    AuthModule,
    CoreJwtModule,
    HallsModule,
    ClassesModule,
    SchedulesModule,
    PricesModule,
    PaymentsModule,
    RegistrationsModule,
    PersonalsModule,
  ],
  controllers: [],
  providers: [RequestService],
})
export class AppModule {}
