import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
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
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
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
  register(@Body() dto: RegisterDto, @Param('role') role: string) {
    return this.authService.register(dto, role);
  }
}
