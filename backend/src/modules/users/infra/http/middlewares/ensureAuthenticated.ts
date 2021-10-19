import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação do token JWT

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Jwt token is missing', 401);
  }

  // Se existit, o token ta no formato: <Bearer tokendeexemploofijoifsorujh> então a ideia é separar essas duas partes
  // seria const[type,token] . Mas nao vai usar o tipo, então deixa [, token]
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
