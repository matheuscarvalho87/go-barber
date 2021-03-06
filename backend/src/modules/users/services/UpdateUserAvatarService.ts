import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import { inject, injectable} from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}
@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
    ){}
  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only autenticade users can change avatar', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFileName)
    user.avatar = avatarFileName;

    // Save serve para criar ou atualizar o usuario caso ele exista
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
