import { ApiProperty } from '@nestjs/swagger';
import { Roles, TRoles } from '@core/types';
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

  @IsString()
  @ApiProperty({
    example: 'Anna',
    description: 'User name',
  })
  readonly firstname: string;

  @IsString()
  @ApiProperty({
    example: 'Ivanova',
    description: 'User lastname',
  })
  readonly lastname: string;

  @IsIn([Roles.admin, Roles.client, Roles.coach])
  @ApiProperty({
    example: Roles.admin,
    description: 'User role',
  })
  readonly role: TRoles;

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
