import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/users.model';
import { ClassesController } from '@classesModule/classes.controller';
import { Class } from '@classesModule/classes.model';
import { ClassesService } from '@classesModule/classes.service';
import { UserClasses } from '@classesModule/user-classes.model';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [SequelizeModule.forFeature([Class, User, UserClasses]), AuthModule],
  exports: [ClassesService],
})
export class ClassesModule {}
