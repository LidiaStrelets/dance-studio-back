import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { Role } from 'src/roles/roles.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  getUserFromToken(bearerToken: string) {
    if (!bearerToken)
      throw new HttpException(
        { message: 'Unauthorized user!' },
        HttpStatus.UNAUTHORIZED,
      );

    const [bearer, token] = bearerToken.split(' ');

    if (bearer !== 'Bearer' || !token)
      throw new HttpException(
        { message: 'Unauthorized user!' },
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const userFromToken: { email: string; id: number; roles: Role[] } =
        this.jwtService.verify(token);
      return userFromToken;
    } catch {
      throw new HttpException(
        { message: 'Unauthorized user!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const user = await this.validateUser(dto);

      return this.generateToken(user);
    } catch (e) {
      throw new HttpException(
        { message: 'Unauthorized user!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async register(dto: RegisterUserDto, role: string) {
    if (role === 'admin' && dto.adminKey !== process.env.ADMIN_KEY) {
      throw new HttpException(
        `Attach an admin key to registrate admin user!!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const candidate = await this.userService.findUserByEmail(dto.email);

    if (candidate)
      throw new HttpException(
        `User with email ${dto.email} already exists!`,
        HttpStatus.BAD_REQUEST,
      );

    const hashedPwd = await bcrypt.hash(dto.password, 6);
    const user = await this.userService.registrateUser(
      {
        ...dto,
        password: hashedPwd,
      },
      role,
    );

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const { email, id, roles } = user;
    const payload = { email, id, roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(dto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user)
      throw new HttpException(
        {
          message: `User with email ${dto.email} doesn't exist!`,
        },
        HttpStatus.BAD_REQUEST,
      );

    const pwdEquals = await bcrypt.compare(dto.password, user.password);
    if (!pwdEquals)
      throw new HttpException(
        {
          message: `Wrong password for email ${dto.email}!`,
        },
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }
}
