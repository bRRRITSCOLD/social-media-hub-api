// node_modules
import * as jsonwebtoken from 'jsonwebtoken';

// libraries
import { env } from '../environment';

export const jwt = {
  verify(token: string): string | any {
    return jsonwebtoken.verify(token, env.JWT_SECRET);
  },
  decode(token: string): string | {
    [key: string]: any;
  } | null {
    return jsonwebtoken.decode(token);
  },
  sign(payload: any): string | {
    [key: string]: any;
  } | null {
    return jsonwebtoken.sign(payload, env.JWT_SECRET);
  },
};
