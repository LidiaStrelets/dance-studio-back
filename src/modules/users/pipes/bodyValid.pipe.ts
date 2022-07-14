import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { EUpdateUser } from '@usersModule/types/types';

@Injectable()
export class BodyValidPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (
      Object.keys(value).some(
        (key) => !Object.keys(EUpdateUser).some((dtoKey) => dtoKey === key),
      )
    ) {
      throw new BadRequestException('Body validation failed');
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
