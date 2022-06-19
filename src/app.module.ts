import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { User } from './modules/users/users.model';
import { Role } from './modules/roles/roles.model';
import { UserRoles } from './modules/roles/user-roles.model';
import { AuthModule } from './modules/auth/auth.module';
import { HallsModule } from './modules/halls/halls.module';
import { ClassesModule } from './modules/classes/classes.module';
import { Class } from './modules/classes/classes.model';
import { UserClasses } from './modules/classes/user-classes.model';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { PricesModule } from './modules/prices/prices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { Payment } from './modules/payments/payments.model';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { Registration } from './modules/registrations/registrations.model';
import { CoreJwtModule } from './core/jwt.module';
import { UnauthorizedMiddleware } from './core/middlewares/unauthorized.middleware';
import { RequestService } from './core/services/request.service';
import { DataOwnerOrAdminMiddleware } from './core/middlewares/dataOwner.middleware';
import { AdminWithUserIdMiddleware } from './core/middlewares/adminWithUserId.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      models: [
        User,
        Role,
        UserRoles,
        Class,
        UserClasses,
        Payment,
        Registration,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CoreJwtModule,
    HallsModule,
    ClassesModule,
    SchedulesModule,
    PricesModule,
    PaymentsModule,
    RegistrationsModule,
  ],
  controllers: [],
  providers: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UnauthorizedMiddleware)
      .forRoutes(
        'classes',
        'halls',
        'payments',
        'prices',
        'registrations',
        'roles',
        'schedules',
        'users',
      );

    consumer
      .apply(DataOwnerOrAdminMiddleware)
      .forRoutes(
        'users/:userId',
        'registrations/:regId',
        'registrations/:userId',
        'payments/:userId',
      );

    consumer
      .apply(AdminWithUserIdMiddleware)
      .forRoutes('registrations', 'payments');
  }
}
