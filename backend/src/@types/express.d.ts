// arquivo para modificar a tipagem de uma biblioteca, nesse caso : express

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
