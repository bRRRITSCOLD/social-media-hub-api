// node_modules
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';

// models
import { User } from '../../../src/models/user';

export class MockUser extends User {
  public constructor() {
    const mockUser = {
      emailAddress: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: uuid(),
    };
    super(mockUser);
  }
}
