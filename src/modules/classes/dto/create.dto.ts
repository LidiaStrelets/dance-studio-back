import { Classes, Dto, TClass } from '@classesModule/types/types';
import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';
import { Dto as UsersDto } from '@usersModule/types/types';

export class CreateClassDto extends BaseEntity {
  @IsIn([
    Classes.poleExotic,
    Classes.poleSport,
    Classes.stretching,
    Classes.stripPlastic,
  ])
  @ApiProperty({
    example: Classes.stretching,
    description: Dto.nameDescription,
  })
  readonly name: TClass;

  @IsString()
  @ApiProperty({
    example: Dto.descriptionExample,
    description: Dto.descriptionDescription,
  })
  readonly description: string;

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.coachDescription,
  })
  readonly coach: string;
}
