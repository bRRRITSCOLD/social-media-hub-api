/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

// libraries
import { integrationTestEnv } from '../../../lib';
import * as cryptography from '../../../../src/lib/cryptography';
import { documentClient } from '../../../../src/lib/aws';

// models
import { TwitterScheduledTweet } from '../../../../src/models/twitter/TwitterScheduledTweet';

// testees
import * as twitterManager from '../../../../src/data-management/twitter';

// mock/static data
import { MockTwitterScheduledTweet } from '../../../data/mock';

let mockTwitterScheduledTweets: Partial<MockTwitterScheduledTweet>[] | Partial<TwitterScheduledTweet>[];

// file constants/functions
async function customStartUp() {
  try {
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

async function customTearDown() {
  try {
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

// tests
describe('data-management/twitter/searchScheduledStatusUpdates integration tests', () => {
  before(async () => {
    try {
      // load envs - do this sequentially
      // to get the right values set - since
      // we need a real user to run twitter tests
      // run "real" env last to set "real" env vars
      await integrationTestEnv.init();
      // asynchronous libraries, connectiones, etc. here
      await Promise.all([]);
      // synchronous libraries, connectiones, etc. here
      [
        documentClient.init({
          endpoint: integrationTestEnv.AWS_DYNAMODB_LOCALSTACK_ENDPOINT,
          region: 'us-east-1',
        }),
      ];
      // cusom start up functionality
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  context('{ searchCriteria: { twitterScreenName }, searchOptions: { limit } }', () => {
    beforeEach(async () => {
      try {
        // create mock data
        mockTwitterScheduledTweets = Array.from({ length: 20 }).map(() => new MockTwitterScheduledTweet());
        // unseed mock data
        const batchWriteRequest = {
          RequestItems: {
            [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledTweets.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledTweet>) => {
              return {
                PutRequest: {
                  Item: mockTwitterScheduledTweet,
                },
              };
            }),
          },
        };
        const batchWriteResponse = await documentClient.client.batchWrite(batchWriteRequest).promise();
        // validate response
        if (!batchWriteResponse.UnprocessedItems || Object.keys(batchWriteResponse.UnprocessedItems).length) throw new Error('Failed to write all items to dynamodb');
        // return explicitly
        return;
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });

    afterEach(async () => {
      try {
        // unseed mock data
        const batchDeleteRequest = {
          RequestItems: {
            [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledTweets.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledTweet>) => {
              return {
                DeleteRequest: {
                  Key: {
                    scheduledTweetId: mockTwitterScheduledTweet.scheduledTweetId,
                    twitterScreenName: mockTwitterScheduledTweet.twitterScreenName,
                  },
                },
              };
            }),
          },
        };
        const batchDeleteResponse = await documentClient.client.batchWrite(batchDeleteRequest).promise();
        // validate response
        if (!batchDeleteResponse.UnprocessedItems || Object.keys(batchDeleteResponse.UnprocessedItems).length) throw new Error('Failed to delete all items from dynamodb');
        // reset mock data holders
        mockTwitterScheduledTweets = [];
      // return explicitly
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });

    it('- should return 1...N scheduled twitter tweet instances that match a given criteria (with or without pagination involved) and have a given set of options applied to them', async () => {
      try {
        // get test copy of
        // data used for test
        const testMockTwitterScheduledTweets = mockTwitterScheduledTweets.slice(0, 10);
        // set expectations
        const EXPECTED_STRING_TYPE_OF = 'string';
        const EXPECTED_ARRAY_CLASS_INSTANCE = Array;
        const EXPECTED_SCHEDULED_STATUS_UPDATES = testMockTwitterScheduledTweets.slice(0, testMockTwitterScheduledTweets.length);
        const EXPECTED_SCHEDULED_STATUS_UPDATES_LENGTH = EXPECTED_SCHEDULED_STATUS_UPDATES.length;
        // intiate holders for test
        let searchScheduledStatusUpdatesResponse;
        let found = 0;
        let tries = 0;
        const maxTries = mockTwitterScheduledTweets.length;
        while (tries < maxTries) {
          // run testee
          searchScheduledStatusUpdatesResponse = await twitterManager.searchScheduledStatusUpdates({
            searchCriteria: {
              twitterScreenName: testMockTwitterScheduledTweets.map((testMockTwitterScheduledTweet) => testMockTwitterScheduledTweet.twitterScreenName) as string[],
            },
            searchOptions: {
              limit: 5,
              exclusiveStartKey: _.get(searchScheduledStatusUpdatesResponse, 'exclusiveStartKey'),
            },
          });
          // validate results
          expect(searchScheduledStatusUpdatesResponse !== undefined).to.be.true;
          expect(searchScheduledStatusUpdatesResponse.exclusiveStartKey === undefined || typeof searchScheduledStatusUpdatesResponse.exclusiveStartKey.scheduledTweetId === EXPECTED_STRING_TYPE_OF).to.be.true;
          expect(searchScheduledStatusUpdatesResponse.exclusiveStartKey === undefined || typeof searchScheduledStatusUpdatesResponse.exclusiveStartKey.twitterScreenName === EXPECTED_STRING_TYPE_OF).to.be.true;
          expect(searchScheduledStatusUpdatesResponse.scheduledStatusUpdates !== undefined).to.be.true;
          expect(searchScheduledStatusUpdatesResponse.scheduledStatusUpdates instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
          for (const scheduledStatusUpdate of searchScheduledStatusUpdatesResponse.scheduledStatusUpdates) {
            const foundExpectedScheduledStatusUpdate = EXPECTED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              scheduledStatusUpdate.autoPopulateReplyMetadata === expectedScheduledStatusUpdate.autoPopulateReplyMetadata
              && scheduledStatusUpdate.inReplyToStatusId === expectedScheduledStatusUpdate.inReplyToStatusId
              && scheduledStatusUpdate.scheduledTweetId === expectedScheduledStatusUpdate.scheduledTweetId
              && scheduledStatusUpdate.status === expectedScheduledStatusUpdate.status
              && scheduledStatusUpdate.twitterScreenName === expectedScheduledStatusUpdate.twitterScreenName);
            expect(foundExpectedScheduledStatusUpdate !== undefined).to.be.true;
            found++;
          }
          if (found === EXPECTED_SCHEDULED_STATUS_UPDATES_LENGTH) {
            break;
          } else {
            tries++;
          }
        }
        expect(found === EXPECTED_SCHEDULED_STATUS_UPDATES_LENGTH).to.be.true;
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
      // cusom start up functionality
      await customTearDown();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
