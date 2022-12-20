import { BaseEntity } from '@core/baseEntity';
import { UUID_EXAMPLE } from '@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Dto as UsersDto } from '@usersModule/types/types';
import { Dto } from '@personalsModule/types/types';

export class CreateMessageDto extends BaseEntity {
  @IsUUID()
  @ApiProperty({
    example: UUID_EXAMPLE,
    description: UsersDto.coachDescription,
  })
  readonly personal_id: string;

  @IsString()
  @ApiProperty({
    example: Dto.messageExample,
    description: Dto.messageDescription as string,
  })
  message: string;
}
