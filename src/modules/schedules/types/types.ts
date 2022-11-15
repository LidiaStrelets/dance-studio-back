import { TClass, TClassUk } from '@classesModule/types/types';

export interface IScheduleResponce {
  coach_id: string;
  hall_id: string;
  class_id: string;
  date_time: Date;
  duration: number;
  id: string;
}

export const PLACES_FIELD = 'places_left';

export enum Dto {
  scheduleDescription = 'The schedule item unique id',
  dateDescription = `Date and time of the class`,
  durationExample = 60,
}

export enum Path {
  withId = 'schedules/:id',
  root = 'schedules',
  enrolled = 'schedules/enrolled/:userId',
}

export interface FullResponce {
  date_time: Date;
  id: string;
  duration: number;
  coach: string;
  coach_id: string;
  hall: string;
  class: TClass;
  class_id: string;
  hallUk: string;
  classUk: TClassUk;
  polesAmount: number;
}

export interface SingleFullResponce extends FullResponce {
  coachInfo: string;
  classInfo: string;
  classInfoUk: string;
}
