/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';

// libraries
import * as testUtils from '../../lib/utils';

// models

// testees
import { User } from '../../../src/models/user';

// mock/static data
import { MockUser } from '../../data/mock/user';

let mockUsers: Partial<User>[] | Partial<MockUser>[];
let staticUsers: Partial<User>[] | Partial<MockUser>[];

let testUsers: Partial<User>[] | Partial<MockUser>[];

// tests
describe('models/user unit tests', () => {
  before(async () => {
    try {
      // setup
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
        testUsers = [];
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    afterEach(async () => {
      try {
        // teardown
        testUsers = [];
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
          testUsers = staticUsers.slice(0, staticUsers.length);
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
          testUsers = mockUsers.slice(0, mockUsers.length);
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
