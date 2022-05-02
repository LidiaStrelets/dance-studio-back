import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/users.model';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { HallsModule } from './halls/halls.module';
import { ClassesModule } from './classes/classes.module';
import { Class } from './classes/classes.model';
import { UserClasses } from './classes/user-classes.model';

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
      models: [User, Role, UserRoles, Class, UserClasses],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    HallsModule,
    ClassesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
