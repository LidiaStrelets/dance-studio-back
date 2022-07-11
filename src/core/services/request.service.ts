import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private userId: string;
  private userRole: string[];

  public setUserId(id: string) {
    this.userId = id;
  }

  public getUserId() {
    return this.userId;
  }

  public setUserRole(roles: string[]) {
    this.userRole = roles;
  }

  public getUserRole() {
    return this.userRole;
  }
}
