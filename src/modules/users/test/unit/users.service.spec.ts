import { Model } from 'sequelize-mock';
import { Test } from '@nestjs/testing';
import { UsersService } from '@usersModule/services/users.service';
import { createUserData } from '@usersModule/test/data/createUser.data';

describe('UsersService', () => {
  let usersService: UsersService;
  const User = new Model('users');

  beforeEach(async () => {
    const moduleRef = Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: User,
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
      test('then it should return array of users', async () => {
        const user = await usersService.registrate(createUserData());

        expect(user.createdAt).toEqual(expect.any(Date));
        expect(user.updatedAt).toEqual(expect.any(Date));
        expect(user.id).toEqual(expect.any(String));
        expect(user).toMatchObject(createUserData());
      });
    });
  });
});
