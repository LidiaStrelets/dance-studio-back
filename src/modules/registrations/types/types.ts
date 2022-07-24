export interface IRegistrationResponce {
  schedule_id: string;
  client_id: string;
  id: string;
}

export enum Paths {
  registrationId = 'registrations/:regId',
  clientId = 'registrations/:userId',
}
