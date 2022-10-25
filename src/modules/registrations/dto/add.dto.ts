import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { Dto as SchedulesDto } from '@schedulesModule/types/types';
import { Dto as UsersDto } from '@usersModule/types/types';

export class CreateRegistrationDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: SchedulesDto.scheduleDescription as string,
  })
  readonly schedule_id: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.clientDescription,
  })
  readonly client_id: string;
}
