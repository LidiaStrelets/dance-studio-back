import { DateDataType } from 'sequelize/types';

export interface IScheduleResponce {
  coach: string;
  hall: string;
  class: string;
  date_time: DateDataType;
  places_left: number;
  id: string;
}

export const PLACES_FIELD = 'places_left';

export enum Dto {
  scheduleDescription = 'The schedule item unique id',
  dateExample = '29.05.2022 12:00',
  dateDescription = `Date and time of the class`,
}

export enum Path {
  withId = 'schedules/:id',
  root = 'schedules',
}
