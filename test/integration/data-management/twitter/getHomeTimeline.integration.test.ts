/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import { testEnv } from '../../../lib';
import { env } from '../../../../src/lib/environment';
import { mongo } from '../../../../src/lib/mongo';
import * as authentication from '../../../../src/lib/authentication';
import * as cryptography from '../../../../src/lib/cryptography';

// models
import { UserTokenInterface, UserTokenTypeEnum } from '../../../../src/models/user-token';
import { APIError } from '../../../../src/models/error';

// testees
import * as twitterManager from '../../../../src/data-management/twitter';

// mock/static/cached data
let cachedTwitterUserToken: UserTokenInterface;

// file constants/functions
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
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

// tests
describe('data-management/twitter integration tests', () => {
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
      [authentication.oAuthConnector.init([...require('../../../../src/configs/oauth').default])];
      // cusom start up functionality
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('#getHomeTimeline', () => {
    context('{ oAuthAccessToken, oAuthAccessTokenSecret, screenName, count }', () => {
      beforeEach(async () => {
        try {
          // search and make sure that we have a user token
          // with type o TWITTER, an oAuthAccessToken and a oAuthAccessTokenSecret
          // return explicitly
          return;
        } catch (err) {
        // throw explicitly
          throw err;
        }
      });

      afterEach(async () => {
        try {
        // return explicitly
        } catch (err) {
        // throw explicitly
          throw err;
        }
      });

      it("- should get a user's home twitter timeline (mix of people you follow, your tweets, etc.) that matches a given criteria", async () => {
        try {
          // run testee
          const getHomeTimelineResponse = await twitterManager.getHomeTimeline({
            oAuthAccessToken: cryptography.decrypt(cachedTwitterUserToken.oAuthAccessToken as string),
            oAuthAccessTokenSecret: cryptography.decrypt(cachedTwitterUserToken.oAuthAccessTokenSecret as string),
            screenName: cachedTwitterUserToken.twitterScreenName,
            count: 50,
          });
          // validate results
          expect(getHomeTimelineResponse !== undefined).to.be.true;
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