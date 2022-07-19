import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class CreateScheduleDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique coach id',
  })
  readonly coach: string;

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique class id',
  })
  readonly class: string;

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique hall id',
  })
  readonly hall: string;

  @IsDateString()
  @ApiProperty({
    example: '29.05.2022 12:00',
    description: `Date and time of the class`,
  })
  readonly date_time: DateDataType;
}
