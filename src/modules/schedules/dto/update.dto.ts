import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class UpdateDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Unique coach id',
  })
  readonly coach: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Unique class id',
  })
  readonly class: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Unique hall id',
  })
  readonly hall: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '29.05.2022 12:00',
    description: `Date and time of the class`,
  })
  readonly date_time: DateDataType;
}
