import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DateDataType } from 'sequelize/types';

export class RegisterUserDto {
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

  @ApiProperty({
    example: 'Anna',
    description: 'User name',
  })
  readonly firstname: string;

  @ApiProperty({
    example: 'Ivanova',
    description: 'User lastname',
  })
  readonly lastname: string;

  @ApiPropertyOptional({
    example: '29.07.1996',
    description: `User's date of birth`,
  })
  readonly birth_date: DateDataType | null;

  @ApiPropertyOptional({
    example: 'Want to visit classes every day!',
    description: `Here you can attach some additional information about uuser`,
  })
  readonly information: string | null;

  @ApiPropertyOptional({
    example: 'jgvjkb76cghvh',
    description: `Here you can attach your admin key`,
  })
  readonly adminKey: string | null;
}
