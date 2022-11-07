import { JWT_SERVICE } from '@core/constants';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ITokenData } from '@authModule/types/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JWT_SERVICE)
    private jwtService: JwtService,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  public getDataFromToken(header: string): ITokenData {
    const [_, authToken] = header.split(' ');
    const decoded = this.jwtService.decode(authToken);

    if (typeof decoded === 'string') {
      return {} as ITokenData;
    }

    return { id: decoded.id, role: decoded.role };
  }
}
