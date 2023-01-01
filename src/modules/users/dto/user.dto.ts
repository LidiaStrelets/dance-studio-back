import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Roles, TRoles } from '@core/types';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseEntity } from '@core/baseEntity';
import { Dto } from '@usersModule/types/types';

export class UserDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: Dto.idExample,
    description: Dto.idDescription,
  })
  readonly id: string;

  @IsEmail()
  @ApiProperty({
    example: Dto.emailExample,
    description: Dto.emailDescription,
  })
  readonly email: string;

  @IsString()
  @ApiProperty({
    example: Dto.nameExample,
    description: Dto.nameDescription,
  })
  readonly firstname: string;

  @IsString()
  @ApiProperty({
    example: Dto.lastNameExample,
    description: Dto.lastNameDescription,
  })
  readonly lastname: string;

  @IsIn([Roles.admin, Roles.client, Roles.coach])
  @ApiProperty({
    example: Roles.client,
    description: Dto.roleDescription,
  })
  readonly role: TRoles;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({
    example: new Date('2000-12-12'),
    description: Dto.birthDateDescription,
  })
  readonly birth_date?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: Dto.informationExample,
    description: Dto.informationDescription,
  })
  readonly information?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: Dto.photoExample,
    description: Dto.photoDescription,
  })
  readonly photo?: string;
}
