import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import { inject, injectable} from 'tsyringe';

interface IRequest {
  email: string;
  password: string;
}
// Separando em um objeto o que a promise retornará

interface IResponse {
  user: User;
  token: string;
}
@injectable()
class AuthenticationUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
    ){}
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }
    // user.password - Senha criptografada
    // password - Senha não criptografada

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Se chegou até aqui usuário autenticado
    const { secret, expiresIn } = authConfig.jwt;
    // Dentro do usuario é bom colocar informações do usuario para usar depois, mas não colocar informações segurar como email e senha
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticationUserService;
