import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'my-email@gmail.com',
    description: 'Unique user email',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  @ApiProperty({
    example: 'qwerty235!',
    description: 'Password',
  })
  readonly password: string;
}
