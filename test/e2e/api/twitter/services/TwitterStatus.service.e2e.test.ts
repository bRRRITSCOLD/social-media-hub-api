/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

// libraries
import Container from 'typedi';
import { e2eTwitterTestEnv } from '../../../../lib';
import { mongo } from '../../../../../src/lib/mongo';
import * as authentication from '../../../../../src/lib/authentication';
import * as cryptography from '../../../../../src/lib/cryptography';

// models

// testees
import { TwitterStatusService } from '../../../../../src/api/twitter/services';

// mock/static data
import { APIError, UserTokenInterface, UserTokenTypeEnum } from '../../../../../src/models';

let cachedUser: UserTokenInterface;

// file constants/functions
const twitterStatusService = Container.get<TwitterStatusService>(TwitterStatusService);

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
    // cache the user
    cachedUser = existingUser;
    // query mongo to get a user's twitter tokens
    const [existingUserToken] = await socialMediaHubDb
      .collection(e2eTwitterTestEnv.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
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
      new Error(`Could not find twitter user token for ${e2eTwitterTestEnv.EMAIL_ADDRESS}`),
    );
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

// tests
describe('api/twitter/services/TwitterStatus.service e2e tests', () => {
  before(async () => {
    try {
      // load envs - do this sequentially
      // to get the right values set - since
      // we need a real user to run twitter tests
      // run "real" env last to set "real" env vars
      await e2eTwitterTestEnv.init();
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../../src/configs/mongo').default]),
      ]);
      // initialize synchronous libraries, connectiones, etc. here
      [authentication.oAuthConnector.init([...require('../../../../../src/configs/oauth').default])];
      // cusom start up functionality
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  context('{ oAuthAccessToken, oAuthAccessTokenSecret, status }', () => {
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

    it("- should post one new tweet (update a user's status) for a user", async () => {
      try {
        // run testee
        const getMentionsTimelineResponse = await twitterStatusService.statusUpdate({
          userId: cachedUser.userId,
          status: `Test message ${uuid()} from NodeJS`,
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

  after(async () => {
    try {
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
