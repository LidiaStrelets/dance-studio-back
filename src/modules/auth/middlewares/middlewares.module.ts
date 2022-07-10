import { createModule } from 'create-nestjs-middleware-module';
import { loginMiddleware } from '@authModule/middlewares/login.middleware';
import { registrationMiddleware } from '@authModule/middlewares/signup.middleware';

export const LoginModule = createModule(loginMiddleware);
export const RegistrationModule = createModule(registrationMiddleware);
