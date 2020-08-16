// node_modules
import { createMethodDecorator } from 'type-graphql';
import { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';
import * as _ from 'lodash';

// libraries
import { jwt } from '../authentication';
import { authorization } from '../authorization';

export function ScopeAuthorization(): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(roles: RoleType[]): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(...roles: RoleType[]): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(...roles: RoleType[]): MethodDecorator | PropertyDecorator {
  return createMethodDecorator(async (ctx: any, next) => {
    const decodedJwt = jwt.decode(ctx.context.reply.request.headers.authorization) as any;
    authorization.roles(
      decodedJwt.roles as string[],
      _.flattenDeep(roles) as string[],
    );
    return next();
  });
}

export function JWTAuthorization(): MethodAndPropDecorator;
export function JWTAuthorization(): MethodDecorator | PropertyDecorator {
  return createMethodDecorator(async (ctx: any, next) => {
    jwt.verify(ctx.context.reply.request.headers.authorization);
    return next();
  });
}
