import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@usersModule/dto/login.dto';
import { RegisterDto } from '@usersModule/dto/register.dto';
import { User } from '@usersModule/models/users.model';
import { UsersService } from '@usersModule/services/users.service';
import { AuthService } from '@authModule/services/auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject('CoreJwtService')
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user!',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Post('/login')
  public async login(@Body() dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    return this.signToken(user);
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAaS51YSIsImlkIjo1LCJyb2xlcyI6W3siaWQiOjEsInRpdGxlIjoiY2xpZW50IiwiZGVzY3JpcHRpb24iOiJUaGlzIHJvbGVzIGFsbG93cyB0by4uLiIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMDJUMDg6NDA6NTMuMDA0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDUtMDJUMDg6NDA6NTMuMDA0WiJ9XSwiaWF0IjoxNjUxNDgyNTA4LCJleHAiOjE2NTE1Njg5MDh9.PSZ0EIIgExi7DaqN8JdsAUlln9w45NLobgbnjlql7SM',
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

  private signToken(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      role: user.role,
      id: user.id,
    });
  }
}
