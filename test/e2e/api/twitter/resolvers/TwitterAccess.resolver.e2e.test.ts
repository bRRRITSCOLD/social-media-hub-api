/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { expect } from 'chai';
import * as _ from 'lodash';
import Container from 'typedi';

// libraries
import { mongo } from '../../../../../src/lib/mongo';
import * as authentication from '../../../../../src/lib/authentication';
import * as cryptography from '../../../../../src/lib/cryptography';
import { e2eTwitterTestEnv } from '../../../../lib';

// models
import { APIError } from '../../../../../src/models/error';
import { AnyObject } from '../../../../../src/models/common';

// services
import { UserAccessService } from '../../../../../src/api/user/services';

// testees
import { bootstrap } from '../../../../../src/app';

let app: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>;

// mock/static/cached data
let cachedUserCredentials: { jwt: string | AnyObject | null; };

// file constants/functions
const userAccessService = Container.get<UserAccessService>(UserAccessService);

async function customStartUp() {
  try {
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // query mongo to get user that is testing
    // by email address (e2eTwitterTestEnv.EMAIL_ADDRESS)
    const [existingUser] = await socialMediaHubDb
      .collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .find({ emailAddress: e2eTwitterTestEnv.EMAIL_ADDRESS, password: { $exists: true, $ne: null } })
      .toArray();
    // validate we found a user
    if (!existingUser) throw new APIError(
      new Error(`Could not find user ${e2eTwitterTestEnv.EMAIL_ADDRESS}`),
    );
    // validate passwords match
    if (!await cryptography.password.compare(e2eTwitterTestEnv.PASSWORD, existingUser.password)) throw new APIError(
      new Error(`Failed to login for user ${e2eTwitterTestEnv.EMAIL_ADDRESS}`),
    );
    // login the user to aquire correct jwt
    const userCredentials = await userAccessService.loginUser({
      emailAddress: e2eTwitterTestEnv.EMAIL_ADDRESS,
      password: e2eTwitterTestEnv.PASSWORD,
      ipAddress: '127.0.0.1',
    });
    // cache the user's credentials
    cachedUserCredentials = _.assign({}, userCredentials);
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

// tests
describe('api/twitter/resolvers/TwitterAccess.resolver e2e tests', () => {
  before(async () => {
    try {
      // load envs - do this sequentially
      // to get the right values set - since
      // we need a real user to run twitter tests
      // run "real" env last to set "real" env vars
      await e2eTwitterTestEnv.init();
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../../src/configs/datasources/mongo').default]),
      ]);
      // initialize synchronous libraries, connectiones, etc. here
      [authentication.oAuthConnector.init([...require('../../../../../src/configs/oauth').default])];
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

  describe('POST /graphql', () => {
    describe('{ query: { mutation { twitterOAuthRequestToken } } }', () => {
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
    });

    describe('{ query: { mutation { twitterOAuthAccessToken } } }', () => {
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

      it('- should finish authing our app and a user through twitter via oauth by generating and stroing oauth access tokens in back end datasource', async () => {
        try {
          // TODO: currently cant test with puppeteer - it complains javascript is not enable, even after expliclty setting it
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
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
