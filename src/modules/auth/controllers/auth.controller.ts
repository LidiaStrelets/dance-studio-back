import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@usersModule/dto/login.dto';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { User } from '@usersModule/models/users.model';
import { UsersService } from '@usersModule/services/users.service';
import { AuthService } from '@authModule/services/auth.service';
import { JWT_SERVICE, TOKEN_EXAMPLE } from '@core/constants';

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
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Post('/login')
  public async login(@Body() dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    return this.signToken(user);
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: TOKEN_EXAMPLE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Attach an admin key to registrate admin user!!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `User with email already exists!`,
  })
  @Post('/registration')
  public async register(@Body() dto: RegisterDto): Promise<string> {
    const password = await this.authService.hashedPassword(dto.password);

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
