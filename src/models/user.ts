import * as _ from 'lodash';

export interface UserInterface {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: boolean;
}

export class User {
  public firstName!: string;
  public lastName!: string;
  public emailAddress!: string;
  public password!: string;

  public constructor(user: Partial<User>) {
    _.assign(this, {
      ...user,
      firstName: _.get(user, 'firstName', 'NA'),
      lastName: _.get(user, 'lastName', 'NA'),
      emailAddress: _.get(user, 'emailAddress', 'NA'),
      password: _.get(user, 'password', 'NA'),
    });
  }

  validate() {

  }

  public validateAsync() {

  }
}
