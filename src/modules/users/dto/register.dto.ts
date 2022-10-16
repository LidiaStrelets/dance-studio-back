import { ApiProperty } from '@nestjs/swagger';
import { Roles, TRoles } from '@core/types';
import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { BaseEntity } from '@core/baseEntity';
import { Dto } from '@usersModule/types/types';

export class RegisterDto extends BaseEntity {
  @IsEmail()
  @ApiProperty({
    example: Dto.emailExample,
    description: Dto.emailDescription,
  })
  readonly email: string;

  @IsString()
  @Length(8, 20)
  @ApiProperty({
    example: Dto.passwordExample,
    description: Dto.passwordDescription,
  })
  readonly password: string;

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
    example: Roles.admin,
    description: Dto.roleDescription,
  })
  readonly role: TRoles;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.keyExample,
    description: Dto.keyDescription,
  })
  readonly adminKey?: string | null;
}
