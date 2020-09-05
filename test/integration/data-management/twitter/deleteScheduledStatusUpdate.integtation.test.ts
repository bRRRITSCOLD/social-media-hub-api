/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

// libraries
import { integrationTestEnv } from '../../../lib';
import { documentClient } from '../../../../src/lib/aws';

// models
import { TwitterScheduledStatusUpdate } from '../../../../src/models/twitter/TwitterSchedulesSatusUpdate';

// testees
import * as twitterManager from '../../../../src/data-management/twitter';

// mock/static data
import { MockTwitterScheduledStatusUpdate } from '../../../data/mock';

let mockTwitterScheduledTweets: Partial<MockTwitterScheduledStatusUpdate>[] | Partial<TwitterScheduledStatusUpdate>[];

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

  beforeEach(async () => {
    try {
      // create mock data
      mockTwitterScheduledTweets = Array.from({ length: 20 }).map(() => new MockTwitterScheduledStatusUpdate());
      // unseed mock data
      const batchWriteRequest = {
        RequestItems: {
          [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledTweets.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledStatusUpdate>) => {
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
          [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledTweets.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledStatusUpdate>) => {
            return {
              DeleteRequest: {
                Key: {
                  scheduledStatusUpdateId: mockTwitterScheduledTweet.scheduledStatusUpdateId,
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

  it('- should delete 1...N twitter scheduled status update instances that match given scheduledStatusUpdateIds and twitterScreenNames ', async () => {
    try {
      // get test copy of
      // data used for test
      const testMockTwitterScheduledStatusUpdates = mockTwitterScheduledTweets.slice(0, 10);
      // set expectations
      const EXPECTED_ARRAY_CLASS_INSTANCE = Array;
      const EXPECTED_UNPROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH = 0;
      const EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS = testMockTwitterScheduledStatusUpdates.slice(0, testMockTwitterScheduledStatusUpdates.length).map((item: any) => ({
        scheduledStatusUpdateId: item.scheduledStatusUpdateId,
        twitterScreenName: item.twitterScreenName,
      }));
      const EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH = EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS.length;
      // intiate holders for test
      // run testee
      const deleteScheduledStatusUpdatesResponse = await twitterManager.deleteScheduledStatusUpdates({
        scheduledStatusUpdateKeys: testMockTwitterScheduledStatusUpdates.map((testMockTwitterScheduledStatusUpdate) => ({
          scheduledStatusUpdateId: testMockTwitterScheduledStatusUpdate.scheduledStatusUpdateId as string,
          twitterScreenName: testMockTwitterScheduledStatusUpdate.twitterScreenName as string,
        })),
      });
      // validate results
      expect(deleteScheduledStatusUpdatesResponse !== undefined).to.be.true;
      expect(deleteScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdateKeys !== undefined).to.be.true;
      expect(deleteScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdateKeys instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
      expect(deleteScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdateKeys?.length === EXPECTED_UNPROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH).to.be.true;
      expect(deleteScheduledStatusUpdatesResponse.processedScheduledStatusUpdateKeys !== undefined).to.be.true;
      expect(deleteScheduledStatusUpdatesResponse.processedScheduledStatusUpdateKeys instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
      expect(deleteScheduledStatusUpdatesResponse.processedScheduledStatusUpdateKeys?.length === EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH).to.be.true;
      for (const processedScheduledStatusUpdateKey of deleteScheduledStatusUpdatesResponse.processedScheduledStatusUpdateKeys) {
        expect(
          EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS.find((expectedScheduledStatusUpdateKey: any) =>
            expectedScheduledStatusUpdateKey.scheduledStatusUpdateId === processedScheduledStatusUpdateKey.scheduledStatusUpdateId
            && expectedScheduledStatusUpdateKey.twitterScreenName === processedScheduledStatusUpdateKey.twitterScreenName) !== undefined,
        ).to.be.true;
      }
      // return explicitly
      return;
    } catch (err) {
    // throw explicitly
      throw err;
    }
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
