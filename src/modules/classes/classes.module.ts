import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from 'src/modules/users/users.model';
import { ClassesController } from './classes.controller';
import { Class } from './classes.model';
import { ClassesService } from './classes.service';
import { UserClasses } from './user-classes.model';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [SequelizeModule.forFeature([Class, User, UserClasses]), AuthModule],
  exports: [ClassesService],
})
export class ClassesModule {}
