import { Test } from '@nestjs/testing';
import { UsersService } from '@usersModule/services/users.service';
import { createUserData } from '@usersModule/test/data/createUser.data';
import { updateRoleData } from '../data/updateRole.data';
import { UserMock } from '@root/database/mock';
import { UUID_EXAMPLE } from '@core/constants';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: UserMock,
        },
      ],
    }).compile();

    usersService = (await moduleRef).get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('rigistrate', () => {
    describe('when registrate is called', () => {
      test('then it should return a user', async () => {
        const user = await usersService.registrate(createUserData());

        expect(user.id).toEqual(expect.any(String));
        expect(user).toMatchObject(createUserData());
      });
    });
  });

  describe('updateRole', () => {
    describe('when updateRole is called', () => {
      test('then it should return array , where the first item is quantity of updated rows', async () => {
        const upd = await usersService.updateRole(updateRoleData());

        expect(upd).toEqual([1]);
      });
    });
  });

  describe('findByEmail', () => {
    describe('when findByEmail is called', () => {
      test('then it should return a user', async () => {
        const user = await usersService.findByEmail(createUserData().email);

        expect(user.email).toEqual(createUserData().email);
      });
    });
  });

  describe('getAll', () => {
    describe('when getAll is called', () => {
      test('then it should return array of all users', async () => {
        const users = await usersService.getAll();
        expect(users[0].id).toEqual(expect.any(String));
        expect(users[0]).toMatchObject(createUserData());
      });
    });
  });

  describe('getById', () => {
    describe('when getById is called', () => {
      test('then it should return a user with certain id', async () => {
        const user = await usersService.getById(UUID_EXAMPLE);

        expect(user.id).toEqual(UUID_EXAMPLE);
        expect(user).toMatchObject(createUserData());
      });
    });
  });

  describe('isCoach', () => {
    describe('when isCoach is called', () => {
      test('then it should return true or false', async () => {
        const isCoach = await usersService.isCoach(UUID_EXAMPLE);

        expect(isCoach).toBeFalsy;
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      test('then it should return an array with number of updated items', async () => {
        const updated = await usersService.update(
          {
            email: 'new-email@gmail.com',
          },
          UUID_EXAMPLE,
        );

        expect(updated).toEqual([1]);
      });
    });
  });
});
