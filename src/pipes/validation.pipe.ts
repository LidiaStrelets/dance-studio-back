import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateRoleDto } from 'src/roles/dto/add-role.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Injectable()
export class ValidationPipe
  implements PipeTransform<RegisterUserDto | LoginUserDto | CreateRoleDto>
{
  async transform(
    value: RegisterUserDto | LoginUserDto | CreateRoleDto,
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
