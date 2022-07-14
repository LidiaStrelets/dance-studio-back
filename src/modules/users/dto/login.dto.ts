import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'my-email@gmail.com',
    description: 'Unique user email',
  })
  readonly email: string;

  @IsString()
  @Length(8, 20)
  @ApiProperty({
    example: 'qwerty235!',
    description: 'Password',
  })
  readonly password: string;
}
