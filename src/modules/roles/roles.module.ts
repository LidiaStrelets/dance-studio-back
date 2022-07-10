import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/models/users.model';
import { RolesController } from '@rolesModule/controllers/roles.controller';
import { Role } from '@rolesModule/models/roles.model';
import { RolesService } from '@rolesModule/services/roles.service';
import { UserRoles } from '@rolesModule/models/user-roles.model';

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
