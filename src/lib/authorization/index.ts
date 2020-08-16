import { APIError } from '../../models/error';

export const STANDARD_USER_ROLE = 'Standard User';

export const authorization = {
  roles(userRoles: string[], authorizedRoles: string[]) {
    if (!authorizedRoles.includes('*')) {
      // map over user roles and determine
      // if the user is apart of any
      // authorized/appropriate roles
      const authorized: boolean[] = userRoles
        .map((userRole: string) => {
          if (authorizedRoles.includes(STANDARD_USER_ROLE) || authorizedRoles.includes(userRole)) {
            return true;
          }
          return false;
        })
        .filter((result: boolean) => result === true);
      // if not authorized throw applicable error
      if (authorized.length === 0) throw new APIError(new Error('Unauthorized'), { statusCode: 403 });
      // return explicitly
      return;
    }
  },
};
