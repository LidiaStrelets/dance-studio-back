import { TUpdateResponce, UpdateResponce } from '@core/types';
import { Test } from '@nestjs/testing';
import { RequestService } from '@services/request.service';
import { UsersController } from '@usersModule/controllers/users.controller';
import { UsersService } from '@usersModule/services/users.service';
import { IUserResponce } from '@usersModule/types/types';
import { mappedUserData } from '../data/mapped.user.data';
import { updateRoleData } from '../data/updateRole.data';
import { userData } from '../data/user.data';

jest.mock('@usersModule/services/users.service');
jest.mock('@core/services/request.service');

describe('usersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService, RequestService],
    }).compile();

    usersController = (await moduleRef).get<UsersController>(UsersController);
    usersService = (await moduleRef).get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    describe('when getAll is called', () => {
      let users: IUserResponce[];

      beforeEach(async () => {
        users = await usersController.getAll();
      });

      test('then it should call usersServise', () => {
        expect(usersService.getAll).toBeCalled;
      });

      test('then it should return array of users', () => {
        expect(users).toEqual([mappedUserData()]);
      });
    });
  });

  describe('getById', () => {
    describe('when getById is called', () => {
      let user: IUserResponce;

      beforeEach(async () => {
        user = await usersController.getById(userData().id);
      });

      test('then it should call usersServise', () => {
        expect(usersService.getById).toBeCalledWith(userData().id);
      });

      test('then it should return an exact user', () => {
        expect(user).toEqual(mappedUserData());
      });
    });
  });

  describe('updateRole', () => {
    describe('when updateRole is called', () => {
      let update: TUpdateResponce;
      beforeEach(async () => {
        update = await usersController.updateRole(updateRoleData());
      });

      test('then it should call usersServise', () => {
        expect(usersService.updateRole).toBeCalledWith(updateRoleData());
      });

      test('then it should return an exact user', () => {
        expect(update).toEqual(UpdateResponce.success);
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let update: TUpdateResponce;
      const emailToUpdate = 'updated.value@gmail.com';

      beforeEach(async () => {
        update = await usersController.update(
          {
            email: emailToUpdate,
          },
          userData().id,
        );
      });

      test('then it should call usersServise', () => {
        expect(usersService.update).toBeCalledWith(
          {
            email: emailToUpdate,
          },
          userData().id,
        );
      });

      test('then it should return an exact user', () => {
        expect(update).toEqual(UpdateResponce.success);
      });
    });
  });
});
