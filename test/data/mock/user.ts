// node_modules
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// models
import {
  User, UserInterface,
} from '../../../src/models/user';

export class MockUser extends User {
  public constructor() {
    const mockUser: UserInterface = {
      userId: uuid(),
      emailAddress: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: uuid(),
      tokens: [uuid()],
    };
    super(mockUser);
  }
}
