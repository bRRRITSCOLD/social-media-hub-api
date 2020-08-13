/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import fastify from 'fastify';
import { expect } from 'chai';
import * as _ from 'lodash';
import puppeteer from 'puppeteer';

// libraries
import { env } from '../../../src/lib/environment';
import { oAuthConnector } from '../../../src/lib/authentication';
import { files } from '../../lib/utils';
import { testEnv } from '../../lib/environment';
import { mongo } from '../../../src/lib/mongo';
import * as cryptography from '../../../src/lib/cryptography';

// models
import { APIError } from '../../../src/models/error';

// testees
import * as twitterManager from '../../../src/data-management/twitter.manager';
import { UserTokenInterface, UserTokenTypeEnum } from '../../../src/models/user-token';

const toCamel = (s: any) => {
  return s.replace(/([-_][a-z])/ig, ($1: any) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const keysToCamel = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i);
    });
  }

  return o;
};
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
describe('data-management/twitter.manager integration tests', () => {
  before(async () => {
    try {
      // load envs
      await Promise.all([
        env.init({
          ...require('../../../src/configs/environment').default,
          options: {
            path: './.env',
            example: './.env.example',
          },
        }),
        testEnv.init({
          ...require('../../../src/configs/environment').default,
          options: {
            path: './.env.test',
            example: './.env.test.example',
          },
        }),
      ]);
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../src/configs/datasources/mongo').default]),
      ]);
      // initialize synchronous libraries, connectiones, etc. here
      [oAuthConnector.init([...require('../../../src/configs/oauth').default])];
      // cusom start up functionality
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('#getOAuthRequestToken', () => {
    beforeEach(async () => {
      try {
      // return explicitly
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

    it('- should get an oauth request token, an oauth request token secret, and additional information from twitter', async () => {
      try {
        // run testee
        const getOAuthRequestTokenResponse = await twitterManager.getOAuthRequestToken();
        // validate results
        expect(getOAuthRequestTokenResponse !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthRequestToken !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthRequestTokenSecret !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthCallbackConfirmed !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthCallbackConfirmed).to.be.true;
        // return explicitly
        return;
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });
  });

  describe('#getUserTimeline', () => {
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

      it("- should get a user's twitter timeline (a user's perosnal tweets) that matches a given criteria", async () => {
        try {
          // run testee
          const getUserTimelineResponse = await twitterManager.getUserTimeline({
            oAuthAccessToken: cryptography.decrypt(cachedTwitterUserToken.oAuthAccessToken as string),
            oAuthAccessTokenSecret: cryptography.decrypt(cachedTwitterUserToken.oAuthAccessTokenSecret as string),
            screenName: cachedTwitterUserToken.twitterScreenName,
            count: 50,
          });
          files.writeFile('example-tweet-user-timeline.json', JSON.stringify(keysToCamel(getUserTimelineResponse), null, 2));
          // validate results
          expect(getUserTimelineResponse !== undefined).to.be.true;
          // return explicitly
          return;
        } catch (err) {
        // throw explicitly
          throw err;
        }
      });
    });
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
          files.writeFile('example-tweet-home-timeline.json', JSON.stringify(keysToCamel(getHomeTimelineResponse), null, 2));
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
          files.writeFile('example-tweet-mentions-timeline.json', JSON.stringify(keysToCamel(getMentionsTimelineResponse), null, 2));
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
