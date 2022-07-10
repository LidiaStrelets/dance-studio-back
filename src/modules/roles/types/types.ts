export enum Roles {
  admin = 'admin',
  coach = 'coach',
  client = 'client',
}

export interface IRoleResponce {
  title: string;
  description: string;
  id: string;
}
