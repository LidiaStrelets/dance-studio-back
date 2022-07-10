import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/users.model';
import { RolesController } from '@rolesModule/roles.controller';
import { Role } from '@rolesModule/roles.model';
import { RolesService } from '@rolesModule/roles.service';
import { UserRoles } from '@rolesModule/user-roles.model';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
    forwardRef(() => AuthModule),
  ],
  exports: [RolesService],
})
export class RolesModule {}

export enum Roles {
  admin = 'admin',
  coach = 'coach',
  client = 'client',
}
