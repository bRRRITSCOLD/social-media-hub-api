/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import Container from 'typedi';
import { env } from '../../../../src/lib/environment';
import { oAuthConnector } from '../../../../src/lib/authentication';
import * as cryptography from '../../../../src/lib/cryptography';
import { testEnv } from '../../../lib/environment';
import { mongo } from '../../../../src/lib/mongo';

// models
import { AnyObject } from '../../../../src/models/any';

// services
import { UserService } from '../../../../src/api/user/user.service';

// testees
import { bootstrap } from '../../../../src/app';
import { APIError } from '../../../../src/models/error';
import { UserTokenInterface, UserTokenTypeEnum } from '../../../../src/models/user-token';

let app: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>;

// mock/static/cached data
let cachedUserCredentials: { jwt: string | AnyObject | null; };
let cachedTwitterUserToken: UserTokenInterface;

// file constants/functions
const userService = Container.get<UserService>(UserService);

async function customStartUp() {
  try {
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // query mongo to get user that is testing
    // by email address (testEnv.EMAIL_ADDRESS)
    const [existingUser] = await socialMediaHubDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .find({ emailAddress: testEnv.EMAIL_ADDRESS, password: { $exists: true, $ne: null } })
      .toArray();
    // validate we found a user
    if (!existingUser) throw new APIError(
      new Error(`Could not find user ${testEnv.EMAIL_ADDRESS}`),
    );
    // validate passwords match
    if (!await cryptography.password.compare(testEnv.PASSWORD, existingUser.password)) throw new APIError(
      new Error(`Failed to login for user ${testEnv.EMAIL_ADDRESS}`),
    );
    // query mongo to get a user's twitter tokens
    const [existingUserToken] = await socialMediaHubDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
      .find({
        userId: existingUser.userId,
        type: UserTokenTypeEnum.TWITTER,
        oAuthAccessToken: { $exists: true, $ne: null },
        oAuthAccessTokenSecret: { $exists: true, $ne: null },
        twitterScreenName: { $exists: true, $ne: null },
        twitterUserId: { $exists: true, $ne: null },
      })
      .toArray();
    // validate we found a twitter user token
    if (!existingUserToken) throw new APIError(
      new Error(`Could not find twitter user token for ${testEnv.EMAIL_ADDRESS}`),
    );
    // cache valid user twitter token to use in tests
    cachedTwitterUserToken = _.assign(
      {},
      existingUserToken,
    );
    // login the user to aquire correct jwt
    const userCredentials = await userService.loginUser({
      emailAddress: testEnv.EMAIL_ADDRESS,
      password: testEnv.PASSWORD,
      ipAddress: '127.0.0.1',
    });
    // cache the user's credentials
    cachedUserCredentials = _.assign({}, userCredentials);
    // create and store app
    app = await bootstrap();
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

// tests
describe('api/twitter/twitter.resolver e2e tests', () => {
  before(async () => {
    try {
      // load envs
      await Promise.all([
        env.init({
          ...require('../../../../src/configs/environment').default,
          options: {
            path: './.env',
            example: './.env.example',
          },
        }),
        testEnv.init({
          ...require('../../../../src/configs/environment').default,
          options: {
            path: './.env.test',
            example: './.env.test.example',
          },
        }),
      ]);
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../src/configs/datasources/mongo').default]),
      ]);
      // initialize synchronous libraries, connectiones, etc. here
      [oAuthConnector.init([...require('../../../../src/configs/oauth').default])];
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
    // describe('{ query: { mutation { twitterOAuthRequestToken } } }', () => {
    //   beforeEach(async () => {
    //     try {
    //       // set up
    //       // none
    //       // return explicitly
    //     } catch (err) {
    //       // throw explicitly
    //       throw err;
    //     }
    //   });

    //   afterEach(async () => {
    //     try {
    //       // set up
    //       // none
    //       // return explicitly
    //     } catch (err) {
    //       // throw explicitly
    //       throw err;
    //     }
    //   });

    //   it('- should return a url to redirect a user to for twitter authorization within our app', async () => {
    //     try {
    //       // set test data
    //       const userCredentials = cachedUserCredentials;
    //       // set expectations
    //       const EXPECTED_STRING_TYPE : any = 'string';
    //       // run testee
    //       const httResponse = await app.inject({
    //         method: 'POST',
    //         url: '/graphql',
    //         headers: {
    //           'content-type': 'application/json',
    //           authorization: userCredentials.jwt as string,
    //         },
    //         payload: {
    //           query: 'mutation { twitterOAuthRequestToken }',
    //         },
    //       });
    //         // validate results
    //       expect(httResponse !== undefined).to.be.true;
    //       expect(httResponse.statusCode !== undefined).to.be.true;
    //       expect(httResponse.statusCode === 200).to.be.true;
    //       expect(httResponse.body !== undefined).to.be.true;
    //       // parse JSON body
    //       const parsedBody = JSON.parse(httResponse.body);
    //       // validate results
    //       expect(parsedBody !== undefined).to.be.true;
    //       expect(parsedBody.data !== undefined).to.be.true;
    //       expect(parsedBody.data.twitterOAuthRequestToken !== undefined).to.be.true;
    //       expect(typeof parsedBody.data.twitterOAuthRequestToken === EXPECTED_STRING_TYPE).to.be.true;
    //       // TODO: check mongo and make sure that there are an oAuthRequestToken and oAuthRequestTokenSecret for a user's twitter token instance
    //       // return explicitly
    //       return;
    //     } catch (err) {
    //       // throw explicitly
    //       throw err;
    //     }
    //   });
    // });

    // describe('{ query: { mutation { twitterOAuthAccessToken } } }', () => {
    //   beforeEach(async () => {
    //     try {
    //       // set up
    //       // none
    //       // return explicitly
    //     } catch (err) {
    //       // throw explicitly
    //       throw err;
    //     }
    //   });

    //   afterEach(async () => {
    //     try {
    //       // set up
    //       // none
    //       // return explicitly
    //     } catch (err) {
    //       // throw explicitly
    //       throw err;
    //     }
    //   });

    //   it('- should finish authing our app and a user through twitter via oauth by generating and stroing oauth access tokens in back end datasource', async () => {
    //     try {
    //       // TODO: currently cant test with puppeteer - it complains javascript is not enable, even after expliclty setting it
    //       // return explicitly
    //       return;
    //     } catch (err) {
    //       // throw explicitly
    //       throw err;
    //     }
    //   });
    // });

    describe('{ query: { twitterUserTimeline() {} } }', () => {
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

      it('- should return a twitter user timeline that matches the given criteria', async () => {
        try {
          // set test data
          const userCredentials = cachedUserCredentials;
          // set expectations
          // const EXPECTED_MINIMUM_TWITTER_USER_TIMELINE_TWEETS_LENGTH: any = 1;
          // run testee
          const httResponse = await app.inject({
            method: 'POST',
            url: '/graphql',
            headers: {
              'content-type': 'application/json',
              authorization: userCredentials.jwt as string,
            },
            payload: {
              query: `{
                twitterUserTimeline(
                  twitterScreenName: "${cachedTwitterUserToken.twitterScreenName}",
                  count: 100
                ) {
                  createdAt,
                  text,
                  source,
                  user {
                    name,
                    screenName
                  }
                }
              }`,
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
