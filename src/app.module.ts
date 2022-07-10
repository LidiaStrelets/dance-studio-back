import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@usersModule/users.module';
import { RolesModule } from '@rolesModule/roles.module';
import { User } from '@usersModule/users.model';
import { Role } from '@rolesModule/roles.model';
import { UserRoles } from '@rolesModule/user-roles.model';
import { AuthModule } from '@authModule/auth.module';
import { HallsModule } from '@hallsModule/halls.module';
import { ClassesModule } from '@classesModule/classes.module';
import { Class } from '@classesModule/classes.model';
import { UserClasses } from '@classesModule/user-classes.model';
import { SchedulesModule } from '@schedulesModule/schedules.module';
import { PricesModule } from '@pricesModule/prices.module';
import { PaymentsModule } from '@paymentsModule/payments.module';
import { Payment } from '@paymentsModule/payments.model';
import { RegistrationsModule } from '@registrationsModule/registrations.module';
import { Registration } from '@registrationsModule/registrations.model';
import { CoreJwtModule } from '@core/jwt.module';
import { UnauthorizedMiddleware } from '@middlewares/unauthorized.middleware';
import { RequestService } from '@services/request.service';
import { DataOwnerOrAdminMiddleware } from '@middlewares/dataOwner.middleware';
import { AdminWithUserIdMiddleware } from '@middlewares/adminWithUserId.middleware';
import { IsCoachMiddleware } from '@middlewares/isCoach.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
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

    consumer
      .apply(IsCoachMiddleware)
      .exclude('schedules/:id')
      .forRoutes('schedules');
  }
}
