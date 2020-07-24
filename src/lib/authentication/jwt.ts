import * as jsonwebtoken from 'jsonwebtoken';

export const jwt = {
  verify(token: string): string | any {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
  },
  decode(token: string): string | {
    [key: string]: any;
  } | null {
    return jsonwebtoken.decode(token);
  },
};
