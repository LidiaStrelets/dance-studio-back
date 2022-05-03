import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from 'src/auth/auth.service';
import { PaymentsService } from 'src/payments/payments.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import { UsersService } from 'src/users/users.service';
import { CreateRegistrationDto } from './dto/add-registration.dto';
import { Registration } from './registrations.model';

export const convertMilisecondsToDays = (ms) => ms / 1000 / 60 / 60 / 24;
export const convertMilisecondsToHours = (ms) => ms / 1000 / 60 / 60;

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(Registration) private registrationRepo: typeof Registration,
    private authService: AuthService,
    private userService: UsersService,
    private paymentService: PaymentsService,
    private scheduleService: SchedulesService,
  ) {}

  async createRegistration(dto: CreateRegistrationDto, headers) {
    const userFromToken = this.authService.getUserFromToken(
      headers.authorization,
    );
    if (userFromToken.roles?.some((r) => r.title === 'admin') && !dto.client_id)
      throw new HttpException(
        { message: 'Client id required!' },
        HttpStatus.BAD_REQUEST,
      );

    const client_id = dto.client_id ? dto.client_id : userFromToken.id;
    if (await this.findExistingRegistration(client_id, dto.schedule_id))
      throw new HttpException(
        { message: 'You already signed for this class!' },
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userService.getUser(client_id.toString());
    const userPaym = await this.paymentService.getLastUserPayment(client_id);

    const days = convertMilisecondsToDays(
      Date.now() - new Date(userPaym.createdAt).getTime(),
    );
    if (days > 30 || userPaym.classes_left === 0)
      throw new HttpException(
        {
          message:
            'Your pass has ended! Make a new payment to create a registration!',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );

    const scheduleItem = await this.scheduleService.getScheduleItem(
      dto.schedule_id,
    );

    if (scheduleItem.places_left === 0)
      throw new HttpException(
        {
          message: 'No places left for this class, try another one!',
        },
        HttpStatus.NOT_FOUND,
      );
    else {
      this.scheduleService.decreaseAvailableSpots(dto.schedule_id);
      if (userPaym.classes_left !== 1000) {
        this.paymentService.decreaseAvailableClasses(userPaym.id);
      }
    }
    if (!user.roles?.some((r) => r.id === 1))
      throw new HttpException(
        { message: 'Registration can be created only for the clients!' },
        HttpStatus.BAD_REQUEST,
      );

    return await this.registrationRepo.create({
      ...dto,
      client_id,
    });
  }

  async cancelRegistration(regId: string, headers) {
    const userFromToken = this.authService.getUserFromToken(
      headers.authorization,
    );

    const existingReg = await this.registrationRepo.findOne({
      where: { id: Number(regId) },
    });
    if (!existingReg)
      throw new HttpException(
        { message: `Registration doesn't exist` },
        HttpStatus.NOT_FOUND,
      );
    if (
      !userFromToken.roles.some((r) => r.id === 3) &&
      existingReg.client_id !== userFromToken.id
    )
      throw new HttpException('Access forbidden!', HttpStatus.FORBIDDEN);

    const userPaym = await this.paymentService.getLastUserPayment(
      existingReg.client_id,
    );

    const hours = convertMilisecondsToHours(
      Date.now() - new Date(existingReg.createdAt).getTime(),
    );
    if (hours < 24) {
      this.paymentService.increaseAvailableClasses(userPaym.id);
    }

    this.scheduleService.increaseAvailableSpots(existingReg.schedule_id);

    return await this.registrationRepo.destroy({
      where: { client_id: existingReg.client_id },
    });
  }

  async findExistingRegistration(userId: number, schId: number) {
    return await this.registrationRepo.findOne({
      where: { client_id: userId, schedule_id: schId },
    });
  }

  async getUserRegistrations(id: number) {
    return await this.registrationRepo.findAll({ where: { client_id: id } });
  }
}
