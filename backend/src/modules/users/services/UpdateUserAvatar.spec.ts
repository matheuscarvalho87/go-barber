import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar',()=>{
  it('should be able to create a new user',async()=>{
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@example.com',
      password:'123456'
    })
    await  updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName:'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update a avar from non existing user',async()=>{
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName:'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one',async()=>{
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@example.com',
      password:'123456'
    })
    await  updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName:'avatar.jpg'
    });

    await  updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName:'avatar2.jpg'
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')

    expect(user.avatar).toBe('avatar2.jpg');
  });


})
