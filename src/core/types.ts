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

export type TRoles = 'admin' | 'coach' | 'client';

export enum ResponceDescription {
  adinKey = 'No admin key provided for coach or admin registration',
  duplicateUser = 'Duplicate user attempt, invalid request body',
  credentials = 'Wrong or missing credentials',
  token = 'Missing or invalid token',
  forbidden = 'Request is sent with inappropriate role or from not corresponding client',
  adminRoute = 'Only with admin rights',
  notClientRoute = 'Forbidden for clients',
  notCoachRoute = 'Forbidden for coaches',
  update = 'Updated user',
  userIdRequired = `You haven't provided client id or id you've provided belongs to not client user`,
  noPlaces = 'No places left for this class, try another one!',
  passExpired = 'Your pass has ended! Make a new payment to create a registration!',
  uuidException = 'The request param should be of uuid type',
  getCoachesDescription = 'Get coaches list',
  updateError = 'Updated more than one entity or entity to update not found',
  notCoach = 'You are trying to create entity passing not a coach id to coach_id field',
  scheduleBadRequest = 'You are passing id of missing item - class, hall or coach',
  personalsBadRequest = 'You are passing id of missing item - class, hall or coach or trying to create several classes with the same date time',
  personalsForbidden = 'You are trying to get coach information for not coach user',
  registrationsBadRequest = 'You are trying to create item with not corresponding user or register twice for the same class',
  registrationNotFound = `You are triyng too delete registration which doesn't exist or for the not existing class`,
  paymentsBadRequest = 'You are trying to create payment with missing price',
}

export enum UpdateResponce {
  success = 'success',
  error = 'error',
}

export type TUpdateResponce = 'success' | 'error';

export enum SocketEvents {
  personalCreated = 'personal-created',
  newPersonal = 'new-personal',
  messageCreated = 'message-created',
  newMessage = 'new-message',
}

export interface SocketMessage {
  personal_id: string;
  message: string;
}

export const StatsResponseType = () => {
  return {
    totalClasses: 11,
    totalMinutes: 660,
    stretching: 3,
    poleSport: 1,
    poleExotic: 5,
    stripPlastic: 1,
    exoticBeginners: 1,
  };
};
