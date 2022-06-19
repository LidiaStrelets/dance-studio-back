import { createModule } from 'create-nestjs-middleware-module';
import { loginMiddleware } from './login.middleware';
import { registrationMiddleware } from './signup.middleware';

export const LoginModule = createModule(loginMiddleware);
export const RegistrationModule = createModule(registrationMiddleware);
