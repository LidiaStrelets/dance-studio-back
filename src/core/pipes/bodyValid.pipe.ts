import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class BodyValidPipe implements PipeTransform<any> {
  private expectedDto;
  constructor(expectedDto) {
    this.expectedDto = expectedDto;
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (
      Object.keys(value.userForm).some(
        (key) =>
          !Object.keys(this.expectedDto).some((dtoKey) => dtoKey === key),
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
