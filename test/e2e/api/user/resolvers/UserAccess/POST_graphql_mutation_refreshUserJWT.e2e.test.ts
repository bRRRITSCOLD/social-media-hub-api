/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-unused-expressions */

// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

// libraries
import { e2eTestEnv, testUtils } from '../../../../../lib';
import { mongo } from '../../../../../../src/lib/mongo';
import * as authentication from '../../../../../../src/lib/authentication';
import * as cryptography from '../../../../../../src/lib/cryptography';

// models
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
let staticUserTokens: Partial<UserToken>[] | Partial<MockUserToken>[];

let testUsers: Partial<User>[] | Partial<MockUser>[];
let testUserTokens: Partial<UserToken>[] | Partial<MockUserToken>[];

async function customStartUp() {
  try {
    // load data for tests
    staticUsers = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/users.json`, { encoding: 'utf-8' }));
    // mockUsers = Array.from({ length: 10 }).map(() => new MockUser());
    staticUserTokens = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/user-tokens.json`, { encoding: 'utf-8' }));
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
describe('api/user/resolvers/UserAccess.resolver - POST /graphql mutation refreshUserJWT integration tests', () => {
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
        testUsers = staticUsers.slice(0, 1);
        testUserTokens = staticUserTokens.slice(0, staticUserTokens.length).filter((staticUserToken: any) => staticUserToken.type === UserTokenTypeEnum.JWT_REFRESH);
        // set data for correlations
        testUserTokens[0] = _.assign(
          {},
          testUserTokens[0],
          { userId: testUsers[0].userId },
        );
        // get mongo connection
        const socialMediaHubDb = await mongo.getConnection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
        // clear data
        await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .deleteMany({});
        // seed data
        const saltRounds = await cryptography.password.genSalt();
        await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .insertMany(await Promise.all(testUsers.map(async (testUser: Partial<User>) =>
            _.assign({}, testUser, { password: await cryptography.password.hash(testUser.password, saltRounds) }))));
        await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
          .insertMany(await Promise.all(testUserTokens.map(async (testUserToken: Partial<UserToken>) =>
            _.assign({}, testUserToken, { jwtRefreshToken: cryptography.encrypt(testUserToken.jwtRefreshToken as string) }))));
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
        await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
          .deleteMany({});
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    it('- should refresh a user\'s jwt and return a new refreshed jwt and jwt refresh token', async () => {
      try {
        /// ////////////////////
        /// ////// SETUP ///////
        /// ////////////////////
        const testUser = testUsers.slice(0, 1)[0];
        const testUserToken = testUserTokens.slice(0, 1)[0];
        /// ////////////////////
        /// ////// TEST ////////
        /// ////////////////////
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
        expect(foundUser.userId === testUser.userId).to.be.true;
        expect(foundUser.emailAddress !== undefined).to.be.true;
        expect(foundUser.emailAddress === testUser.emailAddress).to.be.true;
        expect(foundUser.firstName !== undefined).to.be.true;
        expect(foundUser.firstName === testUser.firstName).to.be.true;
        expect(foundUser.lastName !== undefined).to.be.true;
        expect(foundUser.lastName === testUser.lastName).to.be.true;
        expect(foundUser.password !== undefined).to.be.true;
        expect(await cryptography.password.compare(testUser.password, foundUser.password)).to.be.true;
        // search for user tokens in backend
        let [foundUserToken] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
          .find({ userId: testUser.userId, type: UserTokenTypeEnum.JWT_REFRESH, tokenId: testUserToken.tokenId })
          .toArray();
        // run assertions/validations
        expect(foundUserToken !== undefined).to.be.true;
        expect(foundUserToken.userId !== undefined).to.be.true;
        expect(foundUserToken.userId === testUser.userId).to.be.true;
        expect(foundUserToken.type !== undefined).to.be.true;
        expect(foundUserToken.type === testUserToken.type).to.be.true;
        expect(foundUserToken.tokenId !== undefined).to.be.true;
        expect(foundUserToken.tokenId === testUserToken.tokenId).to.be.true;
        expect(foundUserToken.jwtRefreshToken !== undefined).to.be.true;
        expect(cryptography.decrypt(foundUserToken.jwtRefreshToken as string) === testUserToken.jwtRefreshToken).to.be.true;
        // run testee
        const httResponse = await app.inject({
          method: 'POST',
          url: '/graphql',
          headers: {
            'content-type': 'application/json',
            authorization: authentication.jwt.sign({
              userId: testUser.userId,
              roles: ['Standard User'],
            }) as string,
          },
          payload: {
            query: `mutation refreshUserJWT($data: RefreshUserJWTInputType!) {
              refreshUserJWT(data: $data) {
                jwt,
                jwtRefreshToken
              }
            }`,
            variables: {
              data: {
                jwtRefreshToken: cryptography.sign(testUserToken.jwtRefreshToken as string, e2eTestEnv.COOKIE_SECRET),
              },
            },
          },
        });
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
        expect(parsedBody.data.refreshUserJWT !== undefined).to.be.true;
        expect(parsedBody.data.refreshUserJWT.jwtRefreshToken !== undefined).to.be.true;
        expect(typeof parsedBody.data.refreshUserJWT.jwtRefreshToken === EXPECTED_STRING_TYPE).to.be.true;
        expect(parsedBody.data.refreshUserJWT.jwt !== undefined).to.be.true;
        expect(typeof parsedBody.data.refreshUserJWT.jwt === EXPECTED_STRING_TYPE).to.be.true;
        // search for user in backend
        [foundUser] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
          .find({ userId: testUser.userId })
          .toArray();
        // run assertions/validations
        expect(foundUser !== undefined).to.be.true;
        expect(foundUser.userId !== undefined).to.be.true;
        expect(foundUser.userId === testUser.userId).to.be.true;
        expect(foundUser.emailAddress !== undefined).to.be.true;
        expect(foundUser.emailAddress === testUser.emailAddress).to.be.true;
        expect(foundUser.firstName !== undefined).to.be.true;
        expect(foundUser.firstName === testUser.firstName).to.be.true;
        expect(foundUser.lastName !== undefined).to.be.true;
        expect(foundUser.lastName === testUser.lastName).to.be.true;
        expect(foundUser.password !== undefined).to.be.true;
        expect(await cryptography.password.compare(testUser.password, foundUser.password)).to.be.true;
        // search for user tokens in backend
        [foundUserToken] = await socialMediaHubDb
          .collection(e2eTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
          .find({ userId: testUser.userId, type: UserTokenTypeEnum.JWT_REFRESH, tokenId: testUserToken.tokenId })
          .toArray();
        // run assertions/validations
        expect(foundUserToken !== undefined).to.be.true;
        expect(foundUserToken.userId !== undefined).to.be.true;
        expect(foundUserToken.userId === testUser.userId).to.be.true;
        expect(foundUserToken.type !== undefined).to.be.true;
        expect(foundUserToken.type === UserTokenTypeEnum.JWT_REFRESH).to.be.true;
        expect(foundUserToken.tokenId !== undefined).to.be.true;
        expect(typeof foundUserToken.tokenId === EXPECTED_STRING_TYPE).to.be.true;
        expect(foundUserToken.jwtRefreshToken !== undefined).to.be.true;
        expect(cryptography.decrypt(foundUserToken.jwtRefreshToken) === cryptography.unsign(parsedBody.data.refreshUserJWT.jwtRefreshToken, e2eTestEnv.COOKIE_SECRET)).to.be.true;
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
