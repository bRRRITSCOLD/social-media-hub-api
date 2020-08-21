/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import { testUtils } from '../../../lib';

// models

// testees
import { User } from '../../../../src/models/user';

// mock/static data
import { MockUser } from '../../../data/mock/user';

let staticUsers: Partial<User>[] | Partial<MockUser>[];
let mockUsers: Partial<User>[] | Partial<MockUser>[];

// tests
describe('models/user/User unit tests', () => {
  before(async () => {
    try {
      // setup
      // users
      staticUsers = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/users.json`, { encoding: 'utf-8' }));
      mockUsers = Array.from({ length: 10 }).map(() => new MockUser());
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('{}User', () => {
    beforeEach(async () => {
      try {
        // setup
        // none
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    afterEach(async () => {
      try {
        // teardown
        // none
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    describe('#constructor', () => {
      it('- should create and return a correctly mapped User class instance', () => {
        try {
          // set test data
          const testUsers = staticUsers.slice(0, staticUsers.length);
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          const EXPECTED_USER_DATA: any = testUsers.slice(0, testUsers.length);
          // run constructor fo all static data
          testUsers.reduce((result: undefined, testUser: any) => {
            // run testee
            const user = new User(testUser);
            // validate results
            expect(user !== undefined).to.be.true;
            expect(user instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
            expect(user.firstName !== undefined).to.be.true;
            expect(user.lastName !== undefined).to.be.true;
            expect(user.emailAddress !== undefined).to.be.true;
            expect(user.password !== undefined).to.be.true;
            const foundExpectedUser = EXPECTED_USER_DATA.find((expectedUser: any) => expectedUser.firstName === user.firstName
              && expectedUser.lastName === user.lastName
              && expectedUser.emailAddress === user.emailAddress
              && expectedUser.password === user.password);
            expect(foundExpectedUser !== undefined).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should create and return a correctly mapped User class instance', () => {
        try {
          // set test data
          const testUsers = mockUsers.slice(0, mockUsers.length);
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          const EXPECTED_USER_DATA: any = testUsers.slice(0, testUsers.length);
          // run constructor fo all static data
          testUsers.reduce((result: undefined, testUser: any) => {
            // run testee
            const user = new User(testUser);
            // validate results
            expect(user !== undefined).to.be.true;
            expect(user instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
            expect(user.firstName !== undefined).to.be.true;
            expect(user.lastName !== undefined).to.be.true;
            expect(user.emailAddress !== undefined).to.be.true;
            expect(user.password !== undefined).to.be.true;
            const foundExpectedUser = EXPECTED_USER_DATA.find((expectedUser: any) => expectedUser.firstName === user.firstName
              && expectedUser.lastName === user.lastName
              && expectedUser.emailAddress === user.emailAddress
              && expectedUser.password === user.password);
            expect(foundExpectedUser !== undefined).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });
    });

    describe('#validate', () => {
      it('- should validate (synchronously) a User class instance and return true when the data matches the defined schema', () => {
        try {
          // set test data
          const testUsers = staticUsers.slice(0, staticUsers.length);
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          // run constructor fo all static data
          testUsers.reduce((result: undefined, testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;
            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (synchronously) a User class instance and return false when the data does not match the defined schema', () => {
        try {
          // set test data
          const testUsers = staticUsers.slice(0, staticUsers.length).map((testUser: any) => (_.assign({}, testUser, { firstName: 1 })));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = 'First Name must be a `string` type, but the final value was: `1`.';
          // run constructor fo all static data
          testUsers.reduce((result: undefined, testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error !== undefined).to.be.true;
            expect((validation.error as any).message !== undefined).to.be.true;
            expect((validation.error as any).message === EXPECTED_VALIDATION_ERROR).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (synchronously) a User class instance and return true when the data matches the defined schema', () => {
        try {
          // set test data
          const testUsers = mockUsers.slice(0, mockUsers.length);
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          // run constructor fo all static data
          testUsers.reduce((result: undefined, testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;
            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (synchronously) a User class instance and return false when the data does not match the defined schema', () => {
        try {
          // set test data
          const testUsers = mockUsers.slice(0, mockUsers.length).map((testUser: any) => (_.assign({}, testUser, { firstName: 1 })));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = 'First Name must be a `string` type, but the final value was: `1`.';
          // run constructor fo all static data
          testUsers.reduce((result: undefined, testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error !== undefined).to.be.true;
            expect((validation.error as any).message !== undefined).to.be.true;
            expect((validation.error as any).message === EXPECTED_VALIDATION_ERROR).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });
    });

    describe('#validateAsync', () => {
      it('- should validate (asynchronously) a User class instance and return true when the data matches the defined schema', async () => {
        try {
          // set test data
          const testUsers = staticUsers.slice(0, staticUsers.length);
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          // run constructor fo all static data
          await Promise.all(testUsers.map(async (testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = await user.validateAsync();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;
            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
          }));
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (asynchronously) a User class instance and return false when the data does not match the defined schema', async () => {
        try {
          // set test data
          const testUsers = staticUsers.slice(0, staticUsers.length).map((testUser: any) => (_.assign({}, testUser, { firstName: 1 })));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = 'First Name must be a `string` type, but the final value was: `1`.';
          // run constructor fo all static data
          await Promise.all(testUsers.map(async (testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error !== undefined).to.be.true;
            expect((validation.error as any).message !== undefined).to.be.true;
            expect((validation.error as any).message === EXPECTED_VALIDATION_ERROR).to.be.true;
          }));
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (asynchronously) a User class instance and return true when the data matches the defined schema', async () => {
        try {
          // set test data
          const testUsers = mockUsers.slice(0, mockUsers.length);
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          // run constructor fo all static data
          await Promise.all(testUsers.map(async (testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;
            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
          }));
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (asynchronously) a User class instance and return false when the data does not match the defined schema', async () => {
        try {
          // set test data
          const testUsers = mockUsers.slice(0, mockUsers.length).map((testUser: any) => (_.assign({}, testUser, { firstName: 1 })));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = 'First Name must be a `string` type, but the final value was: `1`.';
          // run constructor fo all static data
          await Promise.all(testUsers.map(async (testUser: any) => {
            // run testee
            const user = new User(testUser);
            const validation = user.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error !== undefined).to.be.true;
            expect((validation.error as any).message !== undefined).to.be.true;
            expect((validation.error as any).message === EXPECTED_VALIDATION_ERROR).to.be.true;
          }));
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });
    });
  });

  after(async () => {
    try {
      // teardown
      // none
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
