import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser',()=>{
  it('should be able to authenticate',async()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);
    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    const user = await createUser.execute({
      name:'Jonh Dow',
      email:'jondoes@example.com',
      password:'2113132'
    })

   const response = await  authenticateUser.execute({
      email:'jondoes@example.com',
      password:'2113132'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user',async()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);

    expect(authenticateUser.execute({
      email:'jondoes@example.com',
      password:'2113132'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password',async()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);
    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    await createUser.execute({
      name:'Jonh Dow',
      email:'jondoes@example.com',
      password:'2113132'
    })

    expect(authenticateUser.execute({
      email:'jondoes@example.com',
      password:'wrong-pass'
    })).rejects.toBeInstanceOf(AppError);
  });

})
