import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/modules/users/dto/login.dto';
import { RegisterDto } from 'src/modules/users/dto/register.dto';
import { User } from 'src/modules/users/users.model';
import { Role } from '../roles/roles.model';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject('CoreJwtService')
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    const token = await this.jwtService.sign({
      email: dto.email,
      role: user.role,
      id: user.id,
    });

    return token;
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 200,
    description:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAaS51YSIsImlkIjo1LCJyb2xlcyI6W3siaWQiOjEsInRpdGxlIjoiY2xpZW50IiwiZGVzY3JpcHRpb24iOiJUaGlzIHJvbGVzIGFsbG93cyB0by4uLiIsImNyZWF0ZWRBdCI6IjIwMjItMDUtMDJUMDg6NDA6NTMuMDA0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDUtMDJUMDg6NDA6NTMuMDA0WiJ9XSwiaWF0IjoxNjUxNDgyNTA4LCJleHAiOjE2NTE1Njg5MDh9.PSZ0EIIgExi7DaqN8JdsAUlln9w45NLobgbnjlql7SM',
  })
  @ApiResponse({
    status: 400,
    description: 'Attach an admin key to registrate admin user!!',
  })
  @ApiResponse({ status: 400, description: `User with email already exists!` })
  @Post('/registration/:role')
  async register(@Body() dto: RegisterDto, @Param('role') role: string) {
    const password = await this.authService.hashedPassword(dto.password);
    const roleObj = await this.rolesService.getByTitle(role);

    const user = await this.usersService.registrate(
      { ...dto, password },
      roleObj,
    );

    const token = await this.jwtService.sign({
      email: dto.email,
      role,
      id: user.id,
    });

    return token;
  }
}
