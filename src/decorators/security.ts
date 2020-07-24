import { createMethodDecorator } from 'type-graphql';
import { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';

// libraries
import { jwt } from '../lib/authentication';
import { authorization } from '../lib/authorization';

export function ScopeAuthorization(): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(roles: RoleType[]): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(...roles: RoleType[]): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(...rolesOrRolesArray: RoleType[]): MethodDecorator | PropertyDecorator {
  return createMethodDecorator(async (ctx: any, next) => {
    authorization.roles(
      (jwt.decode(ctx.context.reply.request.headers.authorization) as any).roles as string[],
      (rolesOrRolesArray[0] as unknown) as string[],
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
