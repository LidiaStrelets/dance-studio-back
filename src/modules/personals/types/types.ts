import { IScheduleResponce, FullResponce } from '@schedulesModule/types/types';

export enum Statuses {
  created = 'created',
  submitted = 'submitted',
  approved = 'approved',
}

export type TStatus = 'created' | 'submitted' | 'approved';

export interface PersonalItem {
  id: string;
  coach_id: string;
  hall_id?: string;
  class_id: string;
  client_id: string;

  date_time: Date;
  duration: number;
  notes?: string;

  status: TStatus;
}

export interface IPersonalResponce extends IScheduleResponce {
  client_id: string;

  status: TStatus;
}

export interface PersonalFullResponce extends FullResponce {
  client_id: string;

  status: TStatus;
}

export enum Dto {
  personalDescription = 'The personal class unique id',
  dateExample = '29.05.2022 12:00',
  dateDescription = `Date and time of the personal class`,
  durationExample = 60,
  statusDescription = 'Personal class status',
  messageExample = 'I would like to have a class in the small hall',
  messageDescription = 'An additional information from coach or client about the personal class',
}

export enum Path {
  withId = 'personals/:userId',
  coach = 'personals/byCoach/:coachId/:date',
  root = 'personals',
}
