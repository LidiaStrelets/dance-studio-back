import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@decorators/roles.decorator';
import { RequestService } from '@services/request.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private requestService: RequestService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: [string] = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const userRole = this.requestService.getUserRole();

    return requiredRoles.some((requiredRole) => userRole === requiredRole);
  }
}
