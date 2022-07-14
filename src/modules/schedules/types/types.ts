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
