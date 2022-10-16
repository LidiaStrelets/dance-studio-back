import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '@usersModule/dto/login.dto';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { User } from '@usersModule/models/users.model';
import { UsersService } from '@usersModule/services/users.service';
import { AuthService } from '@authModule/services/auth.service';
import { JWT_SERVICE, TOKEN_EXAMPLE, UUID_EXAMPLE } from '@core/constants';
import { ResponceDescription } from '@core/types';
import { Response } from 'express';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: TOKEN_EXAMPLE })
  @ApiUnauthorizedResponse({ description: ResponceDescription.credentials })
  @Post('/login')
  public async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.findByEmail(dto.email);

    return res
      .status(HttpStatus.CREATED)
      .send({ data: { token: this.signToken(user) } });
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiOkResponse({ description: TOKEN_EXAMPLE })
  @ApiBadRequestResponse({
    description: ResponceDescription.duplicateUser,
  })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.adinKey,
  })
  @Post('/registration')
  public async register(
    @Body() dto: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const password = await this.authService.hashPassword(dto.password);

    const user = await this.usersService.registrate({ ...dto, password });

    return res
      .status(HttpStatus.CREATED)
      .send({ data: { token: this.signToken(user) } });
  }

  @ApiOperation({
    summary: 'Get current user id from token',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UUID_EXAMPLE })
  @ApiUnauthorizedResponse({
    description: ResponceDescription.token,
  })
  @Get('/currentId')
  public getIdFromToken(
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ) {
    const id = this.authService.getIdFromToken(auth);

    if (!id) {
      throw new HttpException(
        [
          {
            message: ['Invalid token!'],
          },
        ],
        HttpStatus.BAD_REQUEST,
      );
    }

    return res.status(HttpStatus.OK).send({ data: { id } });
  }

  private signToken({ email, role, id }: User): string {
    return this.jwtService.sign({
      email,
      role,
      id,
    });
  }
}
