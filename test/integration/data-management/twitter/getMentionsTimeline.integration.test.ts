/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import { mongo } from '../../../../src/lib/mongo';
import * as authentication from '../../../../src/lib/authentication';
import * as cryptography from '../../../../src/lib/cryptography';
import { integrationTwitterTestEnv } from '../../../lib';

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
    const socialMediaHubDb = await mongo.getConnection(integrationTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // query mongo to get user that is testing
    // by email address (integrationTwitterTestEnv.EMAIL_ADDRESS)
    const [existingUser] = await socialMediaHubDb
      .collection(integrationTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .find({ emailAddress: integrationTwitterTestEnv.EMAIL_ADDRESS, password: { $exists: true, $ne: null } })
      .toArray();
    // validate we found a user
    if (!existingUser) throw new APIError(
      new Error(`Could not find user ${integrationTwitterTestEnv.EMAIL_ADDRESS}`),
    );
    // validate passwords match
    if (!await cryptography.password.compare(integrationTwitterTestEnv.PASSWORD, existingUser.password)) throw new APIError(
      new Error(`Failed to login for user ${integrationTwitterTestEnv.EMAIL_ADDRESS}`),
    );
    // query mongo to get a user's twitter tokens
    const [existingUserToken] = await socialMediaHubDb
      .collection(integrationTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
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
      new Error(`Could not find twitter user token for ${integrationTwitterTestEnv.EMAIL_ADDRESS}`),
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
      // load envs - do this sequentially
      // to get the right values set - since
      // we need a real user to run twitter tests
      // run "real" env last to set "real" env vars
      await integrationTwitterTestEnv.init();
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

  describe('#getMentionsTimeline', () => {
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

      it("- should get a user's mentions twitter timeline (tweets containing mentioning the current user) that matches a given criteria", async () => {
        try {
          // run testee
          const getMentionsTimelineResponse = await twitterManager.getMentionsTimeline({
            oAuthAccessToken: cryptography.decrypt(cachedTwitterUserToken.oAuthAccessToken as string),
            oAuthAccessTokenSecret: cryptography.decrypt(cachedTwitterUserToken.oAuthAccessTokenSecret as string),
            screenName: cachedTwitterUserToken.twitterScreenName,
            count: 100,
          });
          // validate results
          expect(getMentionsTimelineResponse !== undefined).to.be.true;
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
