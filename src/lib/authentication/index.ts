import * as jwt from 'jsonwebtoken';

export const authentication = {
  jwt: {
    verify(token: string) {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    },
    decode(token: string) {
      return jwt.decode(token);
    },
  },
};
