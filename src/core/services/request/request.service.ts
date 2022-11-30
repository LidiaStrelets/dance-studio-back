import { TRoles } from '@core/types';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private userId: string;
  private userRole: TRoles;

  public setUserId(id: string): void {
    this.userId = id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public setUserRole(role: TRoles): void {
    this.userRole = role;
  }

  public getUserRole(): TRoles {
    return this.userRole;
  }
}
