import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@authModule/auth.module';
import { User } from '@usersModule/models/users.model';
import { ClassesController } from '@classesModule/controllers/classes.controller';
import { Class } from '@classesModule/models/classes.model';
import { ClassesService } from '@classesModule/services/classes.service';
import { UserClasses } from '@classesModule/models/user-classes.model';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [SequelizeModule.forFeature([Class, User, UserClasses]), AuthModule],
  exports: [ClassesService],
})
export class ClassesModule {}
