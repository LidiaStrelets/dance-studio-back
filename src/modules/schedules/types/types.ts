export interface IScheduleResponce {
  coach_id: string;
  hall_id: string;
  class_id: string;
  date_time: string;
  duration: number;
  id: string;
}

export const PLACES_FIELD = 'places_left';

export enum Dto {
  scheduleDescription = 'The schedule item unique id',
  dateExample = '29.05.2022 12:00',
  dateDescription = `Date and time of the class`,
  durationExample = 60,
}

export enum Path {
  withId = 'schedules/:id',
  root = 'schedules',
  enrolled = 'schedules/enrolled/:userId',
}

export interface TransformedSchedule extends IScheduleResponce {
  coach: string;
  hall: string;
  class: string;
  hallUk: string;
  classUk: string;
}
