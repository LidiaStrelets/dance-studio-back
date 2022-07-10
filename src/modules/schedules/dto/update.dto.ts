import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class UpdateDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique coach id',
  })
  readonly coach: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique class id',
  })
  readonly class: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
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
