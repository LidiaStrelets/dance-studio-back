import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from '@usersModule/types/types';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: Dto.emailExample,
    description: Dto.emailDescription,
  })
  readonly email: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  @ApiProperty({
    example: Dto.passwordExample,
    description: Dto.passwordDescription,
  })
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.nameExample,
    description: Dto.nameDescription,
  })
  readonly firstname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.lastNameExample,
    description: Dto.lastNameDescription,
  })
  readonly lastname: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: Dto.birthDateExample,
    description: Dto.birthDateDescription,
  })
  readonly birth_date: DateDataType | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: Dto.informationExample,
    description: Dto.informationDescription,
  })
  readonly information: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.keyExample,
    description: Dto.keyDescription,
  })
  readonly adminKey: string | null;
}
