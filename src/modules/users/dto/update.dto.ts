import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Dto } from '@usersModule/types/types';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: Dto.emailExample,
    description: Dto.emailDescription,
  })
  readonly email?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  @ApiProperty({
    example: Dto.passwordExample,
    description: Dto.passwordDescription,
  })
  readonly password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.nameExample,
    description: Dto.nameDescription,
  })
  readonly firstname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.lastNameExample,
    description: Dto.lastNameDescription,
  })
  readonly lastname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: Dto.birthDateExample,
    description: Dto.birthDateDescription,
  })
  readonly birth_date?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: Dto.informationExample,
    description: Dto.informationDescription,
  })
  readonly information?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: Dto.informationExample,
    description: Dto.informationDescription,
  })
  readonly photo?: string | null;
}
