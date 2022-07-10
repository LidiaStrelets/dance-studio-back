import { DateDataType } from 'sequelize/types';

export interface IScheduleResponce {
  coach: string;
  hall: string;
  class: string;
  date_time: DateDataType;
  places_left: number;
  id: string;
}
