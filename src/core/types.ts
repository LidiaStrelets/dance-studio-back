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
  adminRoute = 'Only with admin rights',
  notClientRoute = 'Forbidden for clients',
  notCoachRoute = 'Forbidden for coaches',
  update = 'Success or error string',
  userIdRequired = 'For admin request user id is required',
  noPlaces = 'No places left for this class, try another one!',
  passExpired = 'Your pass has ended! Make a new payment to create a registration!',
  uuidException = 'The request param should be of uuid type',
}

export enum UpdateResponce {
  success = 'success',
  error = 'error',
}
