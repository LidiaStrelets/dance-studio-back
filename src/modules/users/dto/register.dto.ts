import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@rolesModule/types/types';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Anna',
    description: 'User name',
  })
  readonly firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Ivanova',
    description: 'User lastname',
  })
  readonly lastname: string;

  @IsString()
  @IsIn([Roles.admin, Roles.client, Roles.coach])
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin',
    description: 'User role',
  })
  readonly role: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '29.07.1996',
    description: `User's date of birth`,
  })
  readonly birth_date: DateDataType | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Want to visit classes every day!',
    description: `Here you can attach some additional information about uuser`,
  })
  readonly information: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'jgvjkb76cghvh',
    description: `Here you can attach your admin key`,
  })
  readonly adminKey: string | null;
}
