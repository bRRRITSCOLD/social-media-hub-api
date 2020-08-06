/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import * as testUtils from '../../lib/utils';
import { mongo } from '../../../src/lib/mongo';
import { env } from '../../../src/lib/environment';

// models
import { UserToken } from '../../../src/models/user-token';

// testees
import * as userTokenManager from '../../../src/data-management/user-token.manager';

// mock/static data
import { MockUserToken } from '../../data/mock/user-token';

let staticUserTokens: Partial<UserToken>[] | Partial<MockUserToken>[];

let testUserTokens: Partial<UserToken>[] | Partial<MockUserToken>[];

// tests
describe('data-management/user-token integration tests', () => {
  before(async () => {
    try {
      // load env
      await env.init({ ...require('../../../src/configs/environment').default });
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../src/configs/datasources/mongo').default]),
      ]);
      // load data for tests
      staticUserTokens = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/user-tokens.json`, { encoding: 'utf-8' }));
      // mockUsers = Array.from({ length: 10 }).map(() => new MockUser());
      // set env vars accordingly for tests
      env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME = 'userTokenssIntegrationTest';
      // get mongo connection
      const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
      // get current collections
      const collections = await socialMediaHubDb.collections();
      // create test collection if not found
      if (!collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
        await socialMediaHubDb.createCollection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
      // clear test collection
      await socialMediaHubDb.collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME).deleteMany({});
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('#searchUserTokens', () => {
    context('static data', () => {
      context('{ searchCriteria: { tokenId }, searchOptions: { pageNumber: 1, pageSize: Number.MAX_SAFE_INTEGER } }', () => {
        beforeEach(async () => {
          try {
            // create test data
            testUserTokens = staticUserTokens.map((staticUserToken) => ({
              ...staticUserToken,
            }));
            // get mongo connection
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // seed data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
              .insertMany(testUserTokens);
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        afterEach(async () => {
          try {
            // teardown
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // clear data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
              .deleteMany({});
            // reset test data
            testUserTokens = [];
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        it('- should create and return a correctly mapped UserToken class instance', async () => {
          try {
            // set test data
            const testUserToken = testUserTokens.slice(0, 1)[0];
            // set expectations
            const EXPECTED_ARRAY_CLASS_INSTANCE: any = Array;
            const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
            const EXPECTED_USER_TOKENS_LENGTH: any = 1;
            const EXPECTED_USER_TOKENS_DATA: any = [testUserToken].slice(0, 1);
            // run testee
            const searchUserTokensResponse = await userTokenManager.searchUserTokens({
              searchCriteria: { tokenId: testUserToken.tokenId },
              searchOptions: { pageNumber: 1, pageSize: Number.MAX_SAFE_INTEGER, totalCount: true },
            });
            // validate results
            expect(searchUserTokensResponse !== undefined).to.be.true;
            expect(searchUserTokensResponse.totalUserTokens !== undefined).to.be.true;
            expect(searchUserTokensResponse.totalUserTokens === EXPECTED_USER_TOKENS_LENGTH).to.be.true;
            expect(searchUserTokensResponse.moreUserTokens !== undefined).to.be.true;
            expect(searchUserTokensResponse.moreUserTokens).to.be.false;
            expect(searchUserTokensResponse.userTokens !== undefined).to.be.true;
            expect(searchUserTokensResponse.userTokens instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
            searchUserTokensResponse.userTokens.reduce((result: undefined, userToken: any) => {
              expect(userToken !== undefined).to.be.true;
              expect(userToken instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
              expect(userToken.userId !== undefined).to.be.true;
              expect(userToken.tokenId !== undefined).to.be.true;
              expect(userToken.type !== undefined).to.be.true;
              expect(userToken.oAuthAccessToken !== undefined).to.be.true;
              expect(userToken.oAuthAccessTokenSecret !== undefined).to.be.true;
              const foundExpectedUserToken = EXPECTED_USER_TOKENS_DATA.find((expectedUserToken: any) => expectedUserToken.userId === userToken.userId
                && expectedUserToken.tokenId === userToken.tokenId
                && expectedUserToken.type === userToken.type
                && expectedUserToken.oAuthAccessToken === userToken.oAuthAccessToken
                && expectedUserToken.oAuthAccessTokenSecret === userToken.oAuthAccessTokenSecret);
              expect(foundExpectedUserToken !== undefined).to.be.true;
              return result;
            }, undefined);
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

  describe('#putuserToken', () => {
    context('static data', () => {
      context("{ userToken: { ...userToken, oAuthAccessToken: 'UPDATED', oAuthAccessTokenSecret: 'UPDATED' }, putCriteria: { tokenId }, putOptions: {} }", () => {
        beforeEach(async () => {
          try {
            // create test data
            testUserTokens = staticUserTokens.map((staticUserToken) => ({
              ...staticUserToken,
            }));
            // get mongo connection
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // seed data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
              .insertMany(testUserTokens);
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        afterEach(async () => {
          try {
            // teardown
            const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
            // clear data
            await socialMediaHubDb
              .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
              .deleteMany({});
            // reset test data
            testUserTokens = [];
            // return explicitly
          } catch (err) {
            // throw explicitly
            throw err;
          }
        });

        it('- should create and return a correctly mapped UserToken class instance', async () => {
          try {
            // set test data
            const testUserToken = { ...testUserTokens.slice(0, 1)[0], oAuthAccessToken: 'UPDATED', oAuthAccessTokenSecret: 'UPDATED' };
            // set expectations
            const EXPECTED_USER_TOKEN_CLASS_INSTANCE: any = UserToken;
            const EXPECTED_USER_TOKEN_DATA: any = { ...testUserToken };
            // run testee
            const putUserTokenResponse = await userTokenManager.putUserToken({
              userToken: _.omitBy(_.assign({}, testUserToken, { _id: undefined }), _.isUndefined) as any,
              putCriteria: { tokenId: testUserToken.tokenId },
              putOptions: {},
            });
            // validate results
            expect(putUserTokenResponse !== undefined).to.be.true;
            expect(putUserTokenResponse instanceof EXPECTED_USER_TOKEN_CLASS_INSTANCE).to.be.true;
            expect(putUserTokenResponse.tokenId !== undefined).to.be.true;
            expect(putUserTokenResponse.tokenId === EXPECTED_USER_TOKEN_DATA.tokenId).to.be.true;
            expect(putUserTokenResponse.userId !== undefined).to.be.true;
            expect(putUserTokenResponse.userId === EXPECTED_USER_TOKEN_DATA.userId).to.be.true;
            expect(putUserTokenResponse.type !== undefined).to.be.true;
            expect(putUserTokenResponse.type === EXPECTED_USER_TOKEN_DATA.type).to.be.true;
            expect(putUserTokenResponse.oAuthAccessToken !== undefined).to.be.true;
            expect(putUserTokenResponse.oAuthAccessToken === EXPECTED_USER_TOKEN_DATA.oAuthAccessToken).to.be.true;
            expect(putUserTokenResponse.oAuthAccessTokenSecret !== undefined).to.be.true;
            expect(putUserTokenResponse.oAuthAccessTokenSecret === EXPECTED_USER_TOKEN_DATA.oAuthAccessTokenSecret).to.be.true;
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
      if (collections.find((collection) => collection.collectionName === env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME))
        await socialMediaHubDb.dropCollection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME);
      // return explicitly
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
