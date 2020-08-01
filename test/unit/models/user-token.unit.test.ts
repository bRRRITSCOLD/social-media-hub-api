/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import * as testUtils from '../../lib/utils';
import { enumerations } from '../../../src/lib/utils';

// models

// testees
import { UserToken, UserTokenTypeEnum } from '../../../src/models/user-token';

// mock/static data
import { MockUserToken } from '../../data/mock/user-token';

let staticUserTokens: Partial<UserToken>[] | Partial<MockUserToken>[];
let mockUserTokens: Partial<UserToken>[] | Partial<MockUserToken>[];

// tests
describe('models/user-token unit tests', () => {
  before(async () => {
    try {
      // setup
      // user tokens
      staticUserTokens = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/user-tokens.json`, { encoding: 'utf-8' }));
      mockUserTokens = Array.from({ length: 10 }).map(() => new MockUserToken());
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('{}UserToken', () => {
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
      it('- should create and return a correctly mapped UserToken class instance', () => {
        try {
          // set test data
          const testUserTokens = staticUserTokens.slice(0, staticUserTokens.length);
          // set expectations
          const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
          const EXPECTED_USER_TOKEN_DATA: any = testUserTokens.slice(0, testUserTokens.length);
          // run constructor fo all static data
          testUserTokens.reduce((result: undefined, testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            // validate results
            expect(userToken !== undefined).to.be.true;
            expect(userToken instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
            expect(userToken.tokenId !== undefined).to.be.true;
            expect(userToken.type !== undefined).to.be.true;
            expect(userToken.oAuthAccessToken !== undefined).to.be.true;
            expect(userToken.oAuthAccessTokenSecret !== undefined).to.be.true;
            const foundExpectedUserToken = EXPECTED_USER_TOKEN_DATA.find((expectedUserToken: any) => expectedUserToken.tokenId === userToken.tokenId
              && expectedUserToken.type === userToken.type
              && expectedUserToken.oAuthAccessToken === userToken.oAuthAccessToken
              && expectedUserToken.oAuthAccessTokenSecret === userToken.oAuthAccessTokenSecret);
            expect(foundExpectedUserToken !== undefined).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should create and return a correctly mapped UserToken class instance', () => {
        try {
          // set test data
          const testUserTokens = mockUserTokens.slice(0, mockUserTokens.length);
          // set expectations
          const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
          const EXPECTED_USER_TOKEN_DATA: any = testUserTokens.slice(0, testUserTokens.length);
          // run constructor fo all static data
          testUserTokens.reduce((result: undefined, testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            // validate results
            expect(userToken !== undefined).to.be.true;
            expect(userToken instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
            expect(userToken.tokenId !== undefined).to.be.true;
            expect(userToken.type !== undefined).to.be.true;
            expect(userToken.oAuthAccessToken !== undefined).to.be.true;
            expect(userToken.oAuthAccessTokenSecret !== undefined).to.be.true;
            const foundExpectedUserToken = EXPECTED_USER_TOKEN_DATA.find((expectedUserToken: any) => expectedUserToken.tokenId === userToken.tokenId
            && expectedUserToken.type === userToken.type
            && expectedUserToken.oAuthAccessToken === userToken.oAuthAccessToken
            && expectedUserToken.oAuthAccessTokenSecret === userToken.oAuthAccessTokenSecret);
            expect(foundExpectedUserToken !== undefined).to.be.true;
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
      it('- should validate (synchronously) a UserToken class instance and return true when the data matches the defined schema', () => {
        try {
          // set test data
          const testUserTokens = staticUserTokens.slice(0, staticUserTokens.length);
          // set expectations
          const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
          // run constructor fo all static data
          testUserTokens.reduce((result: undefined, testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            const validation = userToken.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;
            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (synchronously) a UserToken class instance and return false when the data does not match the defined schema', () => {
        try {
          // set test data
          const testUserTokens = staticUserTokens.slice(0, staticUserTokens.length).map((staticUserToken: any) => _.assign({}, staticUserToken, { type: 'NOT GOOD' }));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = `Type must be one of the following values: ${enumerations.enumerate(UserTokenTypeEnum).join(', ')}`;

          // run constructor fo all static data
          testUserTokens.reduce((result: undefined, testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            const validation = userToken.validate();
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

      it('- should validate (synchronously) a UserToken class instance and return true when the data matches the defined schema', () => {
        try {
          // set test data
          const testUserTokens = mockUserTokens.slice(0, mockUserTokens.length);
          // set expectations
          const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
          // run constructor fo all static data
          testUserTokens.reduce((result: undefined, testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            const validation = userToken.validate();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;

            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
            return result;
          }, undefined);
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (synchronously) a UserToken class instance and return false when the data does not match the defined schema', () => {
        try {
          // set test data
          const testUserTokens = mockUserTokens.slice(0, mockUserTokens.length).map((mockUserToken: any) => _.assign({}, mockUserToken, { type: 'NOT GOOD' }));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = `Type must be one of the following values: ${enumerations.enumerate(UserTokenTypeEnum).join(', ')}`;
          // run constructor fo all static data
          testUserTokens.reduce((result: undefined, testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            const validation = userToken.validate();
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
      it('- should validate (asynchronously) a UserToken class instance and return true when the data matches the defined schema', async () => {
        try {
          // set test data
          const testUserTokens = staticUserTokens.slice(0, staticUserTokens.length);
          // set expectations
          const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
          // run constructor fo all static data
          await Promise.all(testUserTokens.map(async (testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            const validation = await userToken.validateAsync();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;

            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
          }));
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (asynchronously) a UserToken class instance and return false when the data does not match the defined schema', async () => {
        try {
          // set test data
          const testUserTokens = staticUserTokens.slice(0, mockUserTokens.length).map((testUserToken: any) => _.assign({}, testUserToken, { type: 'NOT GOOD' }));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = `Type must be one of the following values: ${enumerations.enumerate(UserTokenTypeEnum).join(', ')}`;
          // run constructor fo all static data
          await Promise.all(testUserTokens.map(async (testUser: any) => {
            // run testee
            const userToken = new UserToken(testUser);
            const validation = userToken.validate();
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

      it('- should validate (asynchronously) a UserToken class instance and return true when the data matches the defined schema', async () => {
        try {
          // set test data
          const testUserTokens = mockUserTokens.slice(0, mockUserTokens.length);
          // set expectations
          const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
          // run constructor fo all static data
          await Promise.all(testUserTokens.map(async (testUserToken: any) => {
            // run testee
            const userToken = new UserToken(testUserToken);
            const validation = await userToken.validateAsync();
            // validate results
            expect(validation !== undefined).to.be.true;
            expect(validation.error === undefined).to.be.true;

            expect(validation.value !== undefined).to.be.true;
            expect(validation.value instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
          }));
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should validate (asynchronously) a UserToken class instance and return false when the data does not match the defined schema', async () => {
        try {
          // set test data
          const testUserTokens = staticUserTokens.slice(0, mockUserTokens.length).map((testUserToken: any) => _.assign({}, testUserToken, { type: 'NOT GOOD' }));
          // set expectations
          const EXPECTED_VALIDATION_ERROR: any = `Type must be one of the following values: ${enumerations.enumerate(UserTokenTypeEnum).join(', ')}`;

          // run constructor fo all static data
          await Promise.all(testUserTokens.map(async (testUser: any) => {
            // run testee
            const userToken = new UserToken(testUser);
            const validation = userToken.validate();
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
