import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDto } from '@rolesModule/dto/add.dto';
import { LoginDto } from '@usersModule/dto/login.dto';
import { RegisterDto } from '@usersModule/dto/register.dto';

@Injectable()
export class ValidationPipe
  implements PipeTransform<RegisterDto | LoginDto | CreateDto>
{
  async transform(
    value: RegisterDto | LoginDto | CreateDto,
    metadata: ArgumentMetadata,
  ) {
    const obj = plainToClass(metadata.metatype, value);

    const errors = obj && typeof obj !== 'string' && (await validate(obj));

    if (errors && errors.length)
      throw new HttpException(
        {
          message: `${errors.map(
            ({ property, constraints }) =>
              `Incorect value of ${property}: ${Object.values(constraints).join(
                ', ',
              )}`,
          )}`,
        },
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }
}