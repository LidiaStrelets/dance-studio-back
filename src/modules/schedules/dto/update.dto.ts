import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class UpdateDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique coach id',
  })
  readonly coach: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique class id',
  })
  readonly class: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: 'Unique hall id',
  })
  readonly hall: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '29.05.2022 12:00',
    description: `Date and time of the class`,
  })
  readonly date_time: DateDataType;
}
