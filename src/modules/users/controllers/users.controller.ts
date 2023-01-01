import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '@guards/roles.guard';
import { UpdateUserDto } from '@usersModule/dto/update.dto';
import { UsersService } from '@usersModule/services/users.service';
import { User } from '@usersModule/models/users.model';
import { EUpdateUser, IUserResponce } from '@usersModule/types/types';
import { UpdateRoleDto } from '@usersModule/dto/update-role.dto';
import { BodyValidPipe } from '@pipes/bodyValid.pipe';
import { ResponceDescription } from '@core/types';
import { Roles as RolesEnum } from '@core/types';
import { throwUuidException } from '@core/util';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '@decorators/roles.decorator';
import { UpdateErrorService } from '@services/updateError/update-error.service';
import { UserDto } from '@usersModule/dto/user.dto';
import { CoachDto } from '@usersModule/dto/coach.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private updateErrorService: UpdateErrorService,
  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [UserDto] })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @Get()
  public async getAll(): Promise<IUserResponce[]> {
    const users = await this.userService.getAll();

    return users.map((user) => {
      return this.mapUserToResponce(user);
    });
  }

  @ApiOperation({
    summary: 'Get coaches list',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [CoachDto],
    description: ResponceDescription.getCoachesDescription,
  })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/coaches')
  public async getCoaches(): Promise<IUserResponce[]> {
    const coaches = await this.userService.getCoaches();
    return coaches.map((coach) => this.mapUserToResponce(coach));
  }

  @ApiOperation({
    summary: 'Get data about one user',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiBadRequestResponse({ description: ResponceDescription.uuidException })
  @Get('/:userId')
  public async getById(
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    userId: string,
  ): Promise<IUserResponce> {
    const user = await this.userService.getById(userId);
    return this.mapUserToResponce(user);
  }

  // not used yet
  @ApiOperation({ summary: 'Update user role' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: ResponceDescription.token })
  @ApiForbiddenResponse({ description: ResponceDescription.adminRoute })
  @ApiBadRequestResponse({
    description: ResponceDescription.updateError,
  })
  @Roles(RolesEnum.admin)
  @UseGuards(RolesGuard)
  @Patch('/updateRole')
  public async updateRole(@Body() dto: UpdateRoleDto): Promise<IUserResponce> {
    const [updatedNumber, UpdatedItems] = await this.userService.updateRole(
      dto,
    );

    this.updateErrorService.throwError(updatedNumber);

    return this.mapUserToResponce(UpdatedItems[0]);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: ResponceDescription.update, type: UserDto })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @ApiForbiddenResponse({ description: ResponceDescription.forbidden })
  @ApiBadRequestResponse({
    description: `${ResponceDescription.uuidException}; ${ResponceDescription.updateError}`,
  })
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const filename = `${req.params.userId}-${Date.now()}`;
          const fileExt = extname(file.originalname);

          const name = filename + fileExt;
          callback(null, name);
        },
      }),
    }),
  )
  @Patch('/:userId')
  public async update(
    @Body(new BodyValidPipe(EUpdateUser)) dto: { userForm: UpdateUserDto },
    @Param(
      'userId',
      new ParseUUIDPipe({
        exceptionFactory: throwUuidException,
      }),
    )
    id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [updatedNumber, UpdatedItems] = await this.userService.update(
      dto.userForm,
      id,
      file && `${process.env.IMAGES_BASE_URL}${file.filename}`,
    );

    this.updateErrorService.throwError(updatedNumber);

    return res.status(HttpStatus.OK).send({
      user: UpdatedItems[0],
    });
  }

  private mapUserToResponce({
    email,
    firstname,
    lastname,
    birth_date,
    information,
    id,
    role,
    photo,
  }: User): IUserResponce {
    return {
      email,
      firstname,
      lastname,
      birth_date,
      information,
      id,
      role,
      photo,
    };
  }
}
