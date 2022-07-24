import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';
import { DateDataType } from 'sequelize/types';
import { Dto as UsersDto } from '@usersModule/types/types';
import { Dto as ClassesDto } from '@classesModule/types/types';
import { Dto as HallsDto } from '@hallsModule/types/types';
import { Dto } from '@schedulesModule/types/types';

export class CreateScheduleDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.coachDescription,
  })
  readonly coach: string;

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: ClassesDto.idDescription,
  })
  readonly class: string;

  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: HallsDto.idDescription as string,
  })
  readonly hall: string;

  @IsDateString()
  @ApiProperty({
    example: Dto.dateExample,
    description: Dto.dateDescription,
  })
  readonly date_time: DateDataType;
}
