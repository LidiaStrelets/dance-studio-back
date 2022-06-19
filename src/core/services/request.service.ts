import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private userId: string;
  private userRole: string;

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }

  setUserRole(role: string) {
    this.userRole = role;
  }

  getUserRole() {
    return this.userRole;
  }
}
