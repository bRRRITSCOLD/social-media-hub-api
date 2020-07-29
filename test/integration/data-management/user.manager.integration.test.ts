/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import * as testUtils from '../../lib/utils';
import { mongo } from '../../../src/lib/mongo';
import { env } from '../../../src/lib/environment';

// models
import { User } from '../../../src/models/user';

// testees
import * as userManager from '../../../src/data-management/user.manager';

// mock/static data
import { MockUser } from '../../data/mock/user';

// let mockUsers: Partial<User>[] | Partial<MockUser>[];
let staticUsers: Partial<User>[] | Partial<MockUser>[];

let testUsers: Partial<User>[] | Partial<MockUser>[];

// tests
describe('data-management/user integration tests', () => {
  before(async () => {
    try {
      // load env
      await env.init({ ...require('../../../src/configs/environment').default });
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../src/configs/datasources/mongo').default]),
      ]);
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
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('#searchUsers', () => {
    context('static data', () => {
      context('{ searchCriteria: { firstName }, searchOptions: { pageNumber: 1, pageSize: Number.MAX_SAFE_INTEGER } }', () => {
        beforeEach(async () => {
          try {
            // create test data
            testUsers = staticUsers.map((staticUser) => ({
              ...staticUser,
              firstName: uuid(),
            }));
            // get mongo connection
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // seed data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
              .insertMany(testUsers);
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        afterEach(async () => {
          try {
            // teardown
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // clear data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
              .deleteMany({});
            // reset test data
            testUsers = [];
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        it('- should create and return a correctly mapped User class instance', async () => {
          try {
            // set test data
            const testUser = testUsers.slice(0, 1)[0];
            // set expectations
            const EXPECTED_ARRAY_CLASS_INSTANCE: any = Array;
            const EXPECTED_USER_CLASS_INSTANCE: any = User;
            const EXPECTED_USERS_LENGTH: any = 1;
            const EXPECTED_USERS_DATA: any = [testUser].slice(0, 1);
            // run testee
            const searchUsersResponse = await userManager.searchUsers({
              searchCriteria: { firstName: testUser.firstName },
              searchOptions: { pageNumber: 1, pageSize: Number.MAX_SAFE_INTEGER, totalCount: true },
            });
            // validate results
            expect(searchUsersResponse !== undefined).to.be.true;
            expect(searchUsersResponse.totalUsers !== undefined).to.be.true;
            expect(searchUsersResponse.totalUsers === EXPECTED_USERS_LENGTH).to.be.true;
            expect(searchUsersResponse.moreUsers !== undefined).to.be.true;
            expect(searchUsersResponse.moreUsers).to.be.false;
            expect(searchUsersResponse.users !== undefined).to.be.true;
            expect(searchUsersResponse.users instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
            searchUsersResponse.users.reduce((result: undefined, user: any) => {
              expect(user !== undefined).to.be.true;
              expect(user instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
              expect(user.firstName !== undefined).to.be.true;
              expect(user.lastName !== undefined).to.be.true;
              expect(user.emailAddress !== undefined).to.be.true;
              expect(user.password !== undefined).to.be.true;
              const foundExpectedUser = EXPECTED_USERS_DATA.find((expectedUser: any) => expectedUser.firstName === user.firstName
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
