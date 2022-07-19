import { BadRequestException } from '@nestjs/common';
import { ResponceDescription } from '@core/types';

export function throwUuidException() {
  throw new BadRequestException(ResponceDescription.uuidException);
}
