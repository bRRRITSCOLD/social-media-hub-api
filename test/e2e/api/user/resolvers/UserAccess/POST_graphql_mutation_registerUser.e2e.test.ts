/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-unused-expressions */

// node_modules
import { expect } from 'chai';
// import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

// libraries
import { e2eTestEnv, testUtils } from '../../../../../lib';
import { mongo } from '../../../../../../src/lib/mongo';
import * as cryptography from '../../../../../../src/lib/cryptography';

// models
import { User } from '../../../../../../src/models/user';

// mock/static data
import { MockUser } from '../../../../../data/mock/user';

// testees
import { bootstrap } from '../../../../../../src/app';

let app: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>;

// let mockUsers: Partial<User>[] | Partial<MockUser>[];
let staticUsers: Partial<User>[] | Partial<MockUser>[];

let testUsers: Partial<User>[] | Partial<MockUser>[];

async function customStartUp() {
  try {
    // load data for tests
    staticUsers = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/users.json`, { encoding: 'utf-8' }));
    // set env vars accordingly for tests
    e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME = 'usersE2eTest';
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // create test collection if not found
    if (!collections.find((collection) => collection.collectionName === e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
      // clear test collection
    await socialMediaHubDb.collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).deleteMany({});
    // return explicitly
    return;
  } catch (e) {
    throw e;
  }
}

async function customTearDown() {
  try {
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // drop test collection if found
    if (collections.find((collection) => collection.collectionName === e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.dropCollection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
    // return explicitly
    return;
  } catch (e) {
    throw e;
  }
}
// tests
describe('api/user/resolvers/UserAccess.resolver - POST /graphql mutation registerUser e2e tests', () => {
  before(async () => {
    try {
      // load env
      await e2eTestEnv.init();
      // asynchronous start-up tasks
      await Promise.all([
        mongo.init([...require('../../../../../../src/configs/mongo').default]),
      ]);
      // synchronous start-up tasks
      [];
      // create and store app
      app = await bootstrap();
      // run custom start up tasks
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  context('static data', () => {
    beforeEach(async () => {
      try {
        // create test data
        testUsers = staticUsers.slice(0, staticUsers.length);
        // get mongo connection
        const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
        // clear data
        await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
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
        const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
        // clear data
        await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .deleteMany({});
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    it('- should register a user and return the user without a password', async () => {
      try {
        /// ////////////////////
        /// ////// SETUP ///////
        /// ////////////////////
        const testUser = testUsers.slice(0, 1)[0];
        /// ////////////////////
        /// ////// TEST ////////
        /// ////////////////////
        const EXPECTED_USER_DATA: any = [testUser].slice(0, 1)[0];
        // get mongo connection
        const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
        // search for it in back end
        let [foundUser] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .find({ emailAddress: EXPECTED_USER_DATA.emailAddress })
          .toArray();
        // validate results
        expect(foundUser === undefined).to.be.true;
        // run testee
        const httpRequest = {
          method: 'POST',
          url: '/graphql',
          headers: {
            'content-type': 'application/json',
          },
          payload: {
            query: `mutation registerUser($data: RegisterUserInputType!) {
              registerUser(data: $data) {
                emailAddress,
                firstName,
                lastName,
                password
              }
            }`,
            variables: {
              data: {
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                emailAddress: testUser.emailAddress,
                password: testUser.password,
              },
            },
          },
        };
        const httResponse = await app.inject(httpRequest as any);
        // validate results
        expect(httResponse !== undefined).to.be.true;
        expect(httResponse.statusCode !== undefined).to.be.true;
        expect(httResponse.statusCode === 200).to.be.true;
        expect(httResponse.body !== undefined).to.be.true;
        // parse JSON body
        const parsedBody = JSON.parse(httResponse.body);
        // validate results
        expect(parsedBody !== undefined).to.be.true;
        expect(parsedBody.data !== undefined).to.be.true;
        expect(parsedBody.data.registerUser !== undefined).to.be.true;
        expect(parsedBody.data.registerUser.emailAddress !== undefined).to.be.true;
        expect(parsedBody.data.registerUser.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
        expect(parsedBody.data.registerUser.firstName !== undefined).to.be.true;
        expect(parsedBody.data.registerUser.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
        expect(parsedBody.data.registerUser.lastName !== undefined).to.be.true;
        expect(parsedBody.data.registerUser.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
        expect(parsedBody.data.registerUser.password !== undefined).to.be.true;
        expect(parsedBody.data.registerUser.password === null).to.be.true;
        // search for it in back end
        [foundUser] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
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

  after(async () => {
    try {
      // custom tear down logic
      await customTearDown();
      // asynchronous tear down tasks
      await Promise.all([
        mongo.shutdown().catch((_err: any) => {
          // catch as to not interrupt other shutdown tasks -
          // for now think about conole logging the error
        }),
      ]);
      // synchronous tear down tasks
      [];
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
