// TODO: add test for tokens property of User class instance in each applicable test

/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import { integrationTestEnv, testUtils } from '../../../lib';
import { mongo } from '../../../../src/lib/mongo';

// models
import { User } from '../../../../src/models/user';

// testees
import * as userManager from '../../../../src/data-management/user';

// mock/static data
import { MockUser } from '../../../data/mock/user';

// let mockUsers: Partial<User>[] | Partial<MockUser>[];
let staticUsers: Partial<User>[] | Partial<MockUser>[];

let testUsers: Partial<User>[] | Partial<MockUser>[];

// tests
describe('data-management/user/putUser integration tests', () => {
  before(async () => {
    try {
      // load env
      await integrationTestEnv.init();
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../src/configs/datasources/mongo').default]),
      ]);
      // load data for tests
      staticUsers = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/users.json`, { encoding: 'utf-8' }));
      // mockUsers = Array.from({ length: 10 }).map(() => new MockUser());
      // get mongo connection
      const socialMediaHubDb = await mongo.getConnection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
      // get current collections
      const collections = await socialMediaHubDb.collections();
      // create test collection if not found
      if (!collections.find((collection) => collection.collectionName === integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
        await socialMediaHubDb.createCollection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
      // clear test collection
      await socialMediaHubDb.collection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).deleteMany({});
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  context('static data', () => {
    context("{ user: { ...user, firstName: 'UPDATED' }, putCriteria: { emailAddress }, putOptions: {} }", () => {
      beforeEach(async () => {
        try {
          // create test data
          testUsers = staticUsers.map((staticUser) => ({
            ...staticUser,
            firstName: uuid(),
          }));
          // get mongo connection
          const socialMediaHubDb = await mongo.getConnection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // seed data
          await socialMediaHubDb
            .collection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
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
          const socialMediaHubDb = await mongo.getConnection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
          // clear data
          await socialMediaHubDb
            .collection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
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
          const testUser = { ...testUsers.slice(0, 1)[0], firstName: 'UPDATED' };
          // set expectations
          const EXPECTED_USER_CLASS_INSTANCE: any = User;
          const EXPECTED_USER_DATA: any = { ...testUser };
          // run testee
          const putUserResponse = await userManager.putUser({
            user: _.omitBy({ ...testUser, _id: undefined }, _.isUndefined) as any,
            putCriteria: { emailAddress: testUser.emailAddress },
            putOptions: {},
          });
          // validate results
          expect(putUserResponse !== undefined).to.be.true;
          expect(putUserResponse instanceof EXPECTED_USER_CLASS_INSTANCE).to.be.true;
          expect(putUserResponse.emailAddress !== undefined).to.be.true;
          expect(putUserResponse.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
          expect(putUserResponse.firstName !== undefined).to.be.true;
          expect(putUserResponse.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
          expect(putUserResponse.lastName !== undefined).to.be.true;
          expect(putUserResponse.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
          expect(putUserResponse.password !== undefined).to.be.true;
          expect(putUserResponse.password === EXPECTED_USER_DATA.password).to.be.true;
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
      const socialMediaHubDb = await mongo.getConnection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
      // get current collections
      const collections = await socialMediaHubDb.collections();
      // drop test collection if found
      if (collections.find((collection) => collection.collectionName === integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
        await socialMediaHubDb.dropCollection(integrationTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
