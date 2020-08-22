/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import Container from 'typedi';
import * as _ from 'lodash';

// libraries
import { testUtils } from '../../../../lib';
import { env } from '../../../../../src/lib/environment';
import { mongo } from '../../../../../src/lib/mongo';
import * as authentication from '../../../../../src/lib/authentication';
import * as cryptography from '../../../../../src/lib/cryptography';

// models
import { AnyObject } from '../../../../../src/models/common';
import { User } from '../../../../../src/models/user';

// mock/static data
import { MockUser } from '../../../../data/mock/user';

// testees
import { UserAccessService } from '../../../../../src/api/user/services';

const userAccessService = Container.get<UserAccessService>(UserAccessService);

// let mockUsers: Partial<User>[] | Partial<MockUser>[];
let staticUsers: Partial<User>[] | Partial<MockUser>[];

let testUsers: Partial<User>[] | Partial<MockUser>[];

async function customStartUp() {
  try {
    // load data for tests
    staticUsers = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/users.json`, { encoding: 'utf-8' }));
    // mockUsers = Array.from({ length: 10 }).map(() => new MockUser());
    // set env vars accordingly for tests
    env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME = 'usersIntegrationTest';
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // create test collection if not found
    if (!collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
      // clear test collection
    await socialMediaHubDb.collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).deleteMany({});
  } catch (err) {
    throw err;
  }
}

// tests
describe('api/user/services/UserAccess e2e tests', () => {
  before(async () => {
    try {
      // load env
      await env.init({ ...require('../../../../src/configs/environment').default });
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../src/configs/datasources/mongo').default]),
      ]);
      // initailize synchronous libraries, ets
      [];
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('#registerUser', () => {
    context('static data', () => {
      beforeEach(async () => {
        try {
          // create test data
          testUsers = staticUsers.slice(0, staticUsers.length);
          // get mongo connection
          const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // clear data
          await socialMediaHubDb
            .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
            .deleteMany({});
          // return explicitly
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      afterEach(async () => {
        try {
          // reset test data
          testUsers = [];
          // get mongo connection
          const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // clear data
          await socialMediaHubDb
            .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
            .deleteMany({});
          // return explicitly
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should register a user', async () => {
        try {
          // set test data
          const testUser = testUsers.slice(0, 1)[0];
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          const EXPECTED_USER_DATA: any = [testUser].slice(0, 1)[0];
          // run testee
          const registerUserResponse = await userAccessService.registerUser(testUser as any);
          // validate results
          expect(registerUserResponse !== undefined).to.be.true;
          expect(registerUserResponse instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
          expect(registerUserResponse.emailAddress !== undefined).to.be.true;
          expect(registerUserResponse.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
          expect(registerUserResponse.firstName !== undefined).to.be.true;
          expect(registerUserResponse.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
          expect(registerUserResponse.lastName !== undefined).to.be.true;
          expect(registerUserResponse.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
          expect(registerUserResponse.password !== undefined).to.be.true;
          expect(registerUserResponse.password !== EXPECTED_USER_DATA.password).to.be.true;
          expect(await cryptography.password.compare(EXPECTED_USER_DATA.password, registerUserResponse.password)).to.be.true;
          // get mongo connection
          const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // search for it in back end
          const [foundUser] = await socialMediaHubDb
            .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
            .find({ emailAddress: EXPECTED_USER_DATA.emailAddress })
            .toArray();
          // validate results
          expect(foundUser !== undefined).to.be.true;
          expect(foundUser.emailAddress !== undefined).to.be.true;
          expect(foundUser.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
          expect(foundUser.firstName !== undefined).to.be.true;
          expect(foundUser.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
          expect(foundUser.lastName !== undefined).to.be.true;
          expect(foundUser.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
          expect(foundUser.password !== undefined).to.be.true;
          expect(foundUser.password !== undefined).to.be.true;
          expect(foundUser.password !== EXPECTED_USER_DATA.password).to.be.true;
          expect(await cryptography.password.compare(EXPECTED_USER_DATA.password, foundUser.password)).to.be.true;
          // return explicitly
          return;
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });
    });
  });

  describe('#loginUser', () => {
    context('static data', () => {
      beforeEach(async () => {
        try {
          // create test data
          testUsers = staticUsers.slice(0, staticUsers.length);
          // get mongo connection
          const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // clear data
          await socialMediaHubDb
            .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
            .deleteMany({});
          // seed data
          await (async () => {
            const saltRounds = await cryptography.password.genSalt();
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
              .insertMany(await Promise.all(testUsers.map(async (testUser: Partial<User>) =>
                _.assign({}, testUser, { password: await cryptography.password.hash(testUser.password, saltRounds) }))));
          })();
          // return explicitly
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      afterEach(async () => {
        try {
          // reset test data
          testUsers = [];
          // get mongo connection
          const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // clear data
          await socialMediaHubDb
            .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
            .deleteMany({});
          // return explicitly
        } catch (err) {
          // throw explicitly
          throw err;
        }
      });

      it('- should login as a user and return a authentication.jwt for said user', async () => {
        try {
          // set test data
          const testUser = testUsers.slice(0, 1)[0];
          // set expectations
          // const EXPECTED_ARRAY_CLASS_INSTANCE: any = Array;
          // const EXPECTED_USER_CLASS_INSTANCE: any = User;
          // const EXPECTED_USERS_LENGTH: any = 1;
          const EXPECTED_USER_DATA: any = [testUser].slice(0, 1)[0];
          // run testee
          const loginUserResponse = await userAccessService.loginUser({
            emailAddress: testUser.emailAddress as string,
            password: testUser.password as string,
            ipAddress: '127.0.0.1',
          });
          // validate results
          expect(loginUserResponse !== undefined).to.be.true;
          expect(loginUserResponse !== undefined).to.be.true;
          expect(loginUserResponse.jwt !== undefined).to.be.true;
          // decode authentication.jwt
          const decodedJwt: AnyObject = authentication.jwt.decode(loginUserResponse.jwt as string) as AnyObject;
          // validate results
          expect(decodedJwt !== undefined).to.be.true;
          expect(decodedJwt.userId !== undefined).to.be.true;
          expect(decodedJwt.userId === EXPECTED_USER_DATA.userId).to.be.true;
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
      // get mongo connection
      const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
      // get current collections
      const collections = await socialMediaHubDb.collections();
      // drop test collection if found
      if (collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
        await socialMediaHubDb.dropCollection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
