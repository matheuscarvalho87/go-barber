import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService';

describe('CreateUser',()=>{
  it('should be able to create a new user',async()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(fakeUsersRepository,fakeHashProvider);

   const user = await  createUserService.execute({
      name: 'JohnDoe',
      email:'jondoes@example.com',
      password:'2113132'
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user with the same email from another',async()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(fakeUsersRepository,fakeHashProvider);

   await  createUserService.execute({
      name: 'JohnDoe',
      email:'jondoess@example.com',
      password:'2113132'
    });

    expect(createUserService.execute({
      name: 'JohnDoe',
      email:'jondoess@example.com',
      password:'2113132'
    }),
    ).rejects.toBeInstanceOf(AppError);
  });


})
