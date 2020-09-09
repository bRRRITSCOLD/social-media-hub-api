/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { expect } from 'chai';
import * as _ from 'lodash';
import Container from 'typedi';

// libraries
import { mongo } from '../../../../../../src/lib/mongo';
import * as authentication from '../../../../../../src/lib/authentication';
import * as cryptography from '../../../../../../src/lib/cryptography';
import { e2eTwitterTestEnv } from '../../../../../lib';

// models
import { AnyObject } from '../../../../../../src/models/common';

// services
import { UserAccessService } from '../../../../../../src/api/user/services';

// testees
import { bootstrap } from '../../../../../../src/app';
import { User, UserToken, UserTokenTypeEnum } from '../../../../../../src/models';
import { MockUserToken } from '../../../../../data/mock';
import { userTokenManager } from '../../../../../../src/data-management';

let app: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>;

// mock/static/cached data
let cachedUserCredentials: { jwt: string | AnyObject | null; };
let cachedUserTwitterToken: Partial<UserToken> | Partial<MockUserToken>;

// file constants/functions
const userAccessService = Container.get<UserAccessService>(UserAccessService);

async function customStartUp() {
  try {
    // set mongo e2e test collection names
    e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME = 'usersE2eTest';
    e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME = 'userTokensE2eTest';
    // create new user and user twitter token
    const user = new User({
      firstName: 'TEST FIRST NAME',
      lastName: 'TEST LAST NAME',
      emailAddress: e2eTwitterTestEnv.EMAIL_ADDRESS,
      password: await cryptography.password.hash(e2eTwitterTestEnv.PASSWORD, await cryptography.password.genSalt()),
    });
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // create test collection if not found
    if (!collections.find((collection) => collection.collectionName === e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
    if (!collections.find((collection) => collection.collectionName === e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
      await socialMediaHubDb.createCollection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
    // clear test collectionS
    await socialMediaHubDb.collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).deleteMany({});
    await socialMediaHubDb.collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME).deleteMany({});
    // seed data
    await socialMediaHubDb.collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME).insertOne(_.assign({}, user));
    // login the user to aquire correct jwt
    const userCredentials = await userAccessService.loginUser({
      emailAddress: e2eTwitterTestEnv.EMAIL_ADDRESS,
      password: e2eTwitterTestEnv.PASSWORD,
      ipAddress: '127.0.0.1',
    });
    // cache the user's credentials
    cachedUserCredentials = _.assign({}, userCredentials, { emailAddress: e2eTwitterTestEnv.EMAIL_ADDRESS, password: e2eTwitterTestEnv.PASSWORD });
    // return explicitly
    return;
  } catch (e) {
    // throw error explicitly
    throw e;
  }
}

async function customTearDown() {
  try {
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // clear data
    await socialMediaHubDb
      .collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .deleteMany({});
    await socialMediaHubDb
      .collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
      .deleteMany({});
    // get current collections
    const collections = await socialMediaHubDb.collections();
    // drop test collection if found
    if (collections.find((collection: any) => collection.collectionName === e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME))
      await socialMediaHubDb.dropCollection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME);
    if (collections.find((collection: any) => collection.collectionName === e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
      await socialMediaHubDb.dropCollection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
    // return explicitly
    return;
  } catch (e) {
    throw e;
  }
}

// tests
describe('api/twitter/resolvers/TwitterAccess.resolver - POST /graphql mutation twitterOAuthAccessToken e2e tests', () => {
  before(async () => {
    try {
      // load env
      await e2eTwitterTestEnv.init();
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../../../src/configs/mongo').default]),
      ]);
      // initialize synchronous libraries, connectiones, etc. here
      [authentication.oAuthConnector.init([...require('../../../../../../src/configs/oauth').default])];
      // create and store app
      app = await bootstrap();
      // cusom start up functionality
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  beforeEach(async () => {
    try {
      // set up
      // none
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  afterEach(async () => {
    try {
      // set up
      // none
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  it('- should return a url to redirect a user to for twitter authorization within our app', async () => {
    try {
      // set test data
      const userCredentials = cachedUserCredentials;
      // set expectations
      const EXPECTED_STRING_TYPE : any = 'string';
      // run testee
      const httResponse = await app.inject({
        method: 'POST',
        url: '/graphql',
        headers: {
          'content-type': 'application/json',
          authorization: userCredentials.jwt as string,
        },
        payload: {
          query: 'mutation { twitterOAuthRequestToken }',
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
      expect(parsedBody.data.twitterOAuthRequestToken !== undefined).to.be.true;
      expect(typeof parsedBody.data.twitterOAuthRequestToken === EXPECTED_STRING_TYPE).to.be.true;
      // TODO: check mongo and make sure that there are an oAuthRequestToken and oAuthRequestTokenSecret for a user's twitter token instance
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
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
