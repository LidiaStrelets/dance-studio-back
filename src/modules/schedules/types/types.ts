import { TClass, TClassUk } from '@classesModule/types/types';

export interface IScheduleResponce {
  id: string;
  coach_id: string;
  hall_id: string;
  class_id: string;

  date_time: Date;
  duration: number;
}

export interface FullResponce extends IScheduleResponce {
  coach: string;
  hall: string;
  hallUk: string;
  class: TClass;
  classUk: TClassUk;

  polesAmount: number;
}

export interface SingleFullResponce extends FullResponce {
  coachInfo: string;
  classInfo: string;
  classInfoUk: string;
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
