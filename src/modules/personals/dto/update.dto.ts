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
import { Dto as HallsDto } from '@hallsModule/types/types';
import { Dto, Statuses, TStatus } from '@personalsModule/types/types';

export class UpdatePersonalDto extends BaseEntity {
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: Dto.messageExample, //edit this!
    description: Dto.messageDescription as string, //edit this!
  })
  readonly notes: string;
}
