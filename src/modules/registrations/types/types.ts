export interface IRegistrationResponce {
  schedule_id: string;
  client_id: string;
  id: string;
}

export enum Paths {
  scheduleId = 'registrations/:scheduleId',
  clientId = 'registrations/:userId',
  bySchedule = 'registrations/bySchedule/:id',
  root = 'registrations',
}

export interface StatsResponce {
  totalClasses: number;
  totalMinutes: number;
  stretching?: number;
  poleSport?: number;
  poleExotic?: number;
  stripPlastic?: number;
  exoticBeginners?: number;
}
