import { Body, Controller, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
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
import { JWT_SERVICE, TOKEN_EXAMPLE } from '@core/constants';
import { ResponceDescription } from '@core/types';

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
  public async login(@Body() dto: LoginDto): Promise<string> {
    const user = await this.usersService.findByEmail(dto.email);

    return this.signToken(user);
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
  public async register(@Body() dto: RegisterDto): Promise<string> {
    const password = await this.authService.hashPassword(dto.password);

    const user = await this.usersService.registrate({ ...dto, password });

    return this.signToken(user);
  }

  private signToken({ email, role, id }: User): string {
    return this.jwtService.sign({
      email,
      role,
      id,
    });
  }
}
