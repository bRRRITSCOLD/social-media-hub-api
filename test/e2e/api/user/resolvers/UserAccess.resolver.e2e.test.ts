/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
// import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

// libraries
import { testUtils } from '../../../../lib';
import { env } from '../../../../../src/lib/environment';
import { mongo } from '../../../../../src/lib/mongo';
import * as authentication from '../../../../../src/lib/authentication';
import * as cryptography from '../../../../../src/lib/cryptography';

// models
import { AnyObject } from '../../../../../src/models/common';
import { UserToken, UserTokenTypeEnum } from '../../../../../src/models/user-token';
import { User } from '../../../../../src/models/user';

// mock/static data
import { MockUser } from '../../../../data/mock/user';
import { MockUserToken } from '../../../../data/mock/user-token';

// testees
import { bootstrap } from '../../../../../src/app';

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
    env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME = 'usersE2eTest';
    env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME = 'userTokensE2eTest';
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // create test collection if not found
    if (!collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
    if (!collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
      // clear test collection
    await socialMediaHubDb.collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).deleteMany({});
    await socialMediaHubDb.collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME).deleteMany({});
    // create and store app
    app = await bootstrap();
    // return explicitly
    return;
  } catch (e) {
    throw e;
  }
}
// tests
describe('api/user/resolvers/UserAccess.resolver integration tests', () => {
  before(async () => {
    try {
      // load env
      await env.init({ ...require('../../../../../src/configs/environment').default });
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../../src/configs/datasources/mongo').default]),
      ]);
      // synchronous start up init tasks
      [];
      // run custom start up tasks
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('POST /graphql', () => {
    describe('{ query: { mutation { login(data: LoginInputType) } } }', () => {
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

        it('- should register a user and return the user without a password', async () => {
          try {
            // set test data
            const testUser = testUsers.slice(0, 1)[0];
            // set expectations
            // const EXPECTED_ARRAY_CLASS_INSTANCE: any = Array;
            // const EXPECTED_USER_CLASS_INSTANCE: any = User;
            // const EXPECTED_USERS_LENGTH: any = 1;
            const EXPECTED_USER_DATA: any = [testUser].slice(0, 1)[0];
            // run testee
            const httResponse = await app.inject({
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
            expect(parsedBody.data.registerUser !== undefined).to.be.true;
            expect(parsedBody.data.registerUser.emailAddress !== undefined).to.be.true;
            expect(parsedBody.data.registerUser.emailAddress === EXPECTED_USER_DATA.emailAddress).to.be.true;
            expect(parsedBody.data.registerUser.firstName !== undefined).to.be.true;
            expect(parsedBody.data.registerUser.firstName === EXPECTED_USER_DATA.firstName).to.be.true;
            expect(parsedBody.data.registerUser.lastName !== undefined).to.be.true;
            expect(parsedBody.data.registerUser.lastName === EXPECTED_USER_DATA.lastName).to.be.true;
            expect(parsedBody.data.registerUser.password !== undefined).to.be.true;
            expect(parsedBody.data.registerUser.password === null).to.be.true;
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

    describe('{ query: { mutation { registerUser(data: RegisterserInputType) } } }', () => {
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

        it('- should login as a user and return a jwt for said user', async () => {
          try {
            // set test data
            const testUser = testUsers.slice(0, 1)[0];
            // set expectations
            // const EXPECTED_ARRAY_CLASS_INSTANCE: any = Array;
            // const EXPECTED_USER_CLASS_INSTANCE: any = User;
            // const EXPECTED_USERS_LENGTH: any = 1;
            const EXPECTED_USER_DATA: any = [testUser].slice(0, 1)[0];
            const EXPECTED_STRING_TYPE: any = 'string';
            // run testee
            const httResponse = await app.inject({
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
            expect(parsedBody.data.loginUser !== undefined).to.be.true;
            expect(parsedBody.data.loginUser.jwt !== undefined).to.be.true;
            expect(parsedBody.data.loginUser.jwtRefreshToken !== undefined).to.be.true;
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
            // return explicitly
            return;
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });
      });
    });

    describe('{ query: { mutation { refreshUserJwt(data: RefreshUserJwtInputType) } } }', () => {
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
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // clear data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
              .deleteMany({});
            // seed data
            const saltRounds = await cryptography.password.genSalt();
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
              .insertMany(await Promise.all(testUsers.map(async (testUser: Partial<User>) =>
                _.assign({}, testUser, { password: await cryptography.password.hash(testUser.password, saltRounds) }))));
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
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
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // clear data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
              .deleteMany({});
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
              .deleteMany({});
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        it('- should refresh a user\'s jwt and return a new refreshed jwt and jwt refresh token', async () => {
          try {
            // set test data
            const testUser = testUsers.slice(0, 1)[0];
            const testUserToken = testUserTokens.slice(0, 1)[0];
            // set expectations
            const EXPECTED_STRING_TYPE: any = 'string';
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
                    jwtRefreshToken: cryptography.sign(testUserToken.jwtRefreshToken as string, env.COOKIE_SECRET),
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
      if (collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
        await socialMediaHubDb.dropCollection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
