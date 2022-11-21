import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Dto as UsersDto } from '@usersModule/types/types';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Dto as ClassesDto } from '@classesModule/types/types';
import { Dto as HallsDto } from '@hallsModule/types/types';
import { Dto } from '@schedulesModule/types/types';

export class UpdateScheduleDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.coachDescription,
  })
  readonly coach_id: string;

  @IsOptional()
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

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: Dto.durationExample,
    description: HallsDto.idDescription as string,
  })
  readonly duration: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: new Date(),
    description: Dto.dateDescription as string,
  })
  readonly date_time: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: UUID_EXAMPLE, //edit this!
    description: HallsDto.idDescription as string, //edit this!
  })
  readonly notes: string;
}
