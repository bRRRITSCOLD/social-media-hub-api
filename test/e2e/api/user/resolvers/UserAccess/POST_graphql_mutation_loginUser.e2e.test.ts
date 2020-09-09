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
import * as authentication from '../../../../../../src/lib/authentication';
import * as cryptography from '../../../../../../src/lib/cryptography';

// models
import { AnyObject } from '../../../../../../src/models/common';
import { UserToken, UserTokenTypeEnum } from '../../../../../../src/models/user-token';
import { User } from '../../../../../../src/models/user';

// mock/static data
import { MockUser } from '../../../../../data/mock/user';
import { MockUserToken } from '../../../../../data/mock/user-token';

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
    e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME = 'userTokensE2eTest';
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // create test collection if not found
    if (!collections.find((collection: any) => collection.collectionName === e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
    if (!collections.find((collection: any) => collection.collectionName === e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
      // clear test collection
    await socialMediaHubDb.collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).deleteMany({});
    await socialMediaHubDb.collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME).deleteMany({});
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
    if (collections.find((collection: any) => collection.collectionName === e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.dropCollection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
    if (collections.find((collection: any) => collection.collectionName === e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
      await socialMediaHubDb.dropCollection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
    // return explicitly
    return;
  } catch (err) {
    throw err;
  }
}

// tests
describe('api/user/resolvers/UserAccess.resolver - POST /graphql mutation loginUser e2e tests', () => {
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
        // seed data
        await (async () => {
          const saltRounds = await cryptography.password.genSalt();
          await socialMediaHubDb
            .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
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

    it('- should login as a user and return tokens for said user', async () => {
      try {
        /// ////////////////////
        /// ////// SETUP ///////
        /// ////////////////////
        const testUser = testUsers.slice(0, 1)[0];
        /// ////////////////////
        /// ////// TEST ////////
        /// ////////////////////
        const EXPECTED_USER_DATA: any = [testUser].slice(0, 1)[0];
        const EXPECTED_STRING_TYPE: any = 'string';
        // get mongo connection
        const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
        // search for user in backend
        let [foundUser] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .find({ userId: testUser.userId })
          .toArray();
        // run assertions/validations
        expect(foundUser !== undefined).to.be.true;
        expect(foundUser.userId !== undefined).to.be.true;
        expect(foundUser.userId === EXPECTED_USER_DATA.userId).to.be.true;
        expect(foundUser.emailAddress !== undefined).to.be.true;
        expect(foundUser.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
        expect(foundUser.firstName !== undefined).to.be.true;
        expect(foundUser.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
        expect(foundUser.lastName !== undefined).to.be.true;
        expect(foundUser.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
        expect(foundUser.password !== undefined).to.be.true;
        expect(await cryptography.password.compare(EXPECTED_USER_DATA.password, foundUser.password)).to.be.true;
        // search for user tokens in backend
        let [foundUserToken] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
          .find({ userId: testUser.userId, type: UserTokenTypeEnum.JWT_REFRESH })
          .toArray();
        // run assertions/validations
        expect(foundUserToken === undefined).to.be.true;
        // run testee
        const httpRequest = {
          method: 'POST',
          url: '/graphql',
          headers: {
            'content-type': 'application/json',
          },
          payload: {
            query: `mutation loginUser($data: LoginUserInputType!) {
              loginUser(data: $data) {
                jwt,
                jwtRefreshToken
              }
            }`,
            variables: {
              data: {
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
        expect(parsedBody.data.loginUser !== undefined).to.be.true;
        expect(parsedBody.data.loginUser.jwt !== undefined).to.be.true;
        expect(typeof parsedBody.data.loginUser.jwt === EXPECTED_STRING_TYPE).to.be.true;
        expect(parsedBody.data.loginUser.jwtRefreshToken !== undefined).to.be.true;
        expect(typeof parsedBody.data.loginUser.jwtRefreshToken === EXPECTED_STRING_TYPE).to.be.true;
        // decode jwt
        const decodedJwt: AnyObject = authentication.jwt.decode(parsedBody.data.loginUser.jwt as string) as AnyObject;
        // validate results
        expect(decodedJwt !== undefined).to.be.true;
        expect(decodedJwt.userId !== undefined).to.be.true;
        expect(decodedJwt.userId === EXPECTED_USER_DATA.userId).to.be.true;
        expect(decodedJwt.roles !== undefined).to.be.true;
        expect(decodedJwt.userId === EXPECTED_USER_DATA.userId).to.be.true;
        (decodedJwt.roles as string[]).map((role: string): void => {
          expect(typeof role === EXPECTED_STRING_TYPE).to.be.true;
          return;
        });
        // search for user in backend
        [foundUser] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .find({ userId: testUser.userId })
          .toArray();
        // run assertions/validations
        expect(foundUser !== undefined).to.be.true;
        expect(foundUser.userId !== undefined).to.be.true;
        expect(foundUser.userId === EXPECTED_USER_DATA.userId).to.be.true;
        expect(foundUser.emailAddress !== undefined).to.be.true;
        expect(foundUser.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
        expect(foundUser.firstName !== undefined).to.be.true;
        expect(foundUser.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
        expect(foundUser.lastName !== undefined).to.be.true;
        expect(foundUser.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
        expect(foundUser.password !== undefined).to.be.true;
        expect(await cryptography.password.compare(EXPECTED_USER_DATA.password, foundUser.password)).to.be.true;
        // search for user tokens in backend
        [foundUserToken] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
          .find({ userId: testUser.userId, type: UserTokenTypeEnum.JWT_REFRESH })
          .toArray();
        // run assertions/validations
        expect(foundUserToken !== undefined).to.be.true;
        expect(foundUserToken.tokenId !== undefined).to.be.true;
        expect(typeof foundUserToken.tokenId === EXPECTED_STRING_TYPE).to.be.true;
        expect(foundUserToken.type !== undefined).to.be.true;
        expect(foundUserToken.type === UserTokenTypeEnum.JWT_REFRESH).to.be.true;
        expect(foundUserToken.jwtRefreshToken !== undefined).to.be.true;
        expect(typeof foundUserToken.jwtRefreshToken === EXPECTED_STRING_TYPE).to.be.true;
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
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
