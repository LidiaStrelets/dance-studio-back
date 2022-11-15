import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Dto as UsersDto } from '@usersModule/types/types';
import { Dto as ClassesDto } from '@classesModule/types/types';
import { Dto as HallsDto } from '@hallsModule/types/types';
import { Dto, Statuses, TStatus } from '@personalsModule/types/types';

export class CreatePersonalDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.coachDescription,
  })
  readonly coach_id: string;

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: ClassesDto.idDescription,
  })
  readonly class_id: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: HallsDto.idDescription as string,
  })
  readonly hall_id: string;

  @IsNumber()
  @ApiProperty({
    example: Dto.durationExample,
    description: HallsDto.idDescription as string,
  })
  readonly duration: number;

  @IsDateString()
  @ApiProperty({
    example: new Date(),
    description: Dto.dateDescription as string,
  })
  readonly date_time: Date;

  @IsString()
  @ApiProperty({
    example: Statuses.created,
    description: Dto.statusDescription as string,
  })
  readonly status: TStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.messageExample,
    description: Dto.messageDescription as string,
  })
  readonly message: string;
}
