import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { User } from 'src/users/users.model';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized user!' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @Post('/login')
  login(@Body() userDto: LoginUserDto, @Headers() headers) {
    return this.authService.login(userDto, headers);
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
  register(@Body() userDto: RegisterUserDto, @Param('role') role: string) {
    return this.authService.register(userDto, role);
  }
}
