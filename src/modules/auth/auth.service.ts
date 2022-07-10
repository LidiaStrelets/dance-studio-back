import { Injectable } from '@nestjs/common';
import { UsersService } from '@usersModule/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  public async hashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }
}
