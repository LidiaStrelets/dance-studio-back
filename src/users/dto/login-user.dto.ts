import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'my-email@gmail.com',
    description: 'Unique user email',
  })
  readonly email: string;

  @ApiProperty({
    example: 'qwerty235!',
    description: 'Password',
  })
  readonly password: string;
}
