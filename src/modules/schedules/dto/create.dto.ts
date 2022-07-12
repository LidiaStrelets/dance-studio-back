import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { DateDataType } from 'sequelize/types';

export class CreateDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique coach id',
  })
  readonly coach: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique class id',
  })
  readonly class: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
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
