import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RolesService } from '@rolesModule/services/roles.service';

@Injectable()
export class ExistsRoleMiddleware {
  constructor(private rolesService: RolesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const role = await this.rolesService.getByTitle(req.body.title);

    if (!role) {
      throw new HttpException(
        { message: 'Requested role not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
