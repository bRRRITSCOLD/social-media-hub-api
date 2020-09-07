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
import { TwitterScheduledStatusUpdate } from '../../../../src/models/twitter/TwitterScheduledStatusUpdate';

// testees
import * as twitterManager from '../../../../src/data-management/twitter';

// mock/static data
import { MockTwitterScheduledStatusUpdate } from '../../../data/mock';
import { AnyObject } from '../../../../src/models';

let mockTwitterScheduledStatusUpdates: Partial<MockTwitterScheduledStatusUpdate>[] | Partial<TwitterScheduledStatusUpdate>[];

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
describe('data-management/twitter/putScheduledStatusUpdates integration tests', () => {
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

  context('non-existing items', () => {
    beforeEach(async () => {
      try {
        // create mock data
        mockTwitterScheduledStatusUpdates = Array.from({ length: 2 }).map(() => new MockTwitterScheduledStatusUpdate());
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
            [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledStatusUpdates.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledStatusUpdate>) => {
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
        mockTwitterScheduledStatusUpdates = [];
      // return explicitly
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });

    it('- should replace 1...N twitter scheduled status update instances that already exist and create 1...N twitter scheduled statu update instances that do not already exist', async () => {
      try {
        // get test copy of
        // data used for test
        const testMockTwitterScheduledStatusUpdates = mockTwitterScheduledStatusUpdates.slice(0, 2);
        // set expectations
        const EXPECTED_ARRAY_CLASS_INSTANCE = Array;
        const EXPECTED_UNPROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH = 0;
        const EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES = testMockTwitterScheduledStatusUpdates.slice(0, testMockTwitterScheduledStatusUpdates.length).map((item: any) => ({
          scheduledStatusUpdateId: item.scheduledStatusUpdateId,
          twitterScreenName: item.twitterScreenName,
        }));
        const EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH = EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.length;
        // scan dynamo db to verify
        let [{
          FilterExpression, ExpressionAttributeValues,
        }] = testMockTwitterScheduledStatusUpdates
          .reduce(
            (dynamoDBQuery: [{ ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }], testMockTwitterScheduledStatusUpdate: any, index: number) => {
              const screenNameReplacementKey = `:twitterScreenName${index}`;
              const scheduledStatusUpdateIdReplacementKey = `:scheduledStatusUpdateId${index}`;
              dynamoDBQuery[0].ExpressionAttributeValues[screenNameReplacementKey] = testMockTwitterScheduledStatusUpdate.twitterScreenName;
              dynamoDBQuery[0].ExpressionAttributeValues[scheduledStatusUpdateIdReplacementKey] = testMockTwitterScheduledStatusUpdate.scheduledStatusUpdateId;
              dynamoDBQuery[0].ScreenNameFilterExpressionValues.push(screenNameReplacementKey);
              dynamoDBQuery[0].ScheduledStatusUpdateIdFilterExpressionValues.push(scheduledStatusUpdateIdReplacementKey);
              return dynamoDBQuery;
            },
            [{ ExpressionAttributeValues: {}, ScreenNameFilterExpressionValues: [], ScheduledStatusUpdateIdFilterExpressionValues: [] }],
          )
          .map((dynamoDBQuery: { ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }) => ({
            FilterExpression: `twitterScreenName IN (${dynamoDBQuery.ScreenNameFilterExpressionValues.join(', ')}) AND scheduledStatusUpdateId IN (${dynamoDBQuery.ScheduledStatusUpdateIdFilterExpressionValues.join(', ')})`,
            ExpressionAttributeValues: dynamoDBQuery.ExpressionAttributeValues,
          }));
        // run testee
        let scanResponse = await documentClient.client
          .scan({
            TableName: integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME,
            FilterExpression,
            ExpressionAttributeValues,
          })
          .promise();
        // store found items
        expect(scanResponse !== undefined).to.be.true;
        expect(scanResponse.Items !== undefined).to.be.true;
        expect(scanResponse.Items instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect((scanResponse.Items as any[]).length === 0).to.be.true;
        // run testee
        const putScheduledStatusUpdatesResponse = await twitterManager.putScheduledStatusUpdates({
          scheduledStatusUpdates: testMockTwitterScheduledStatusUpdates.slice(0, testMockTwitterScheduledStatusUpdates.length) as any[],
        });
        // validate results
        expect(putScheduledStatusUpdatesResponse !== undefined).to.be.true;
        expect(putScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdates !== undefined).to.be.true;
        expect(putScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdates instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect(putScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdates?.length === EXPECTED_UNPROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH).to.be.true;
        expect(putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates !== undefined).to.be.true;
        expect(putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect(putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates?.length === EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH).to.be.true;
        for (const processedScheduledStatusUpdate of putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates) {
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === processedScheduledStatusUpdate.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === processedScheduledStatusUpdate.twitterScreenName) !== undefined,
          ).to.be.true;
        }
        // scan dynamo db to verify
        [{
          FilterExpression, ExpressionAttributeValues,
        }] = testMockTwitterScheduledStatusUpdates
          .reduce(
            (dynamoDBQuery: [{ ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }], testMockTwitterScheduledStatusUpdate: any, index: number) => {
              const screenNameReplacementKey = `:twitterScreenName${index}`;
              const scheduledStatusUpdateIdReplacementKey = `:scheduledStatusUpdateId${index}`;
              dynamoDBQuery[0].ExpressionAttributeValues[screenNameReplacementKey] = testMockTwitterScheduledStatusUpdate.twitterScreenName;
              dynamoDBQuery[0].ExpressionAttributeValues[scheduledStatusUpdateIdReplacementKey] = testMockTwitterScheduledStatusUpdate.scheduledStatusUpdateId;
              dynamoDBQuery[0].ScreenNameFilterExpressionValues.push(screenNameReplacementKey);
              dynamoDBQuery[0].ScheduledStatusUpdateIdFilterExpressionValues.push(scheduledStatusUpdateIdReplacementKey);
              return dynamoDBQuery;
            },
            [{ ExpressionAttributeValues: {}, ScreenNameFilterExpressionValues: [], ScheduledStatusUpdateIdFilterExpressionValues: [] }],
          )
          .map((dynamoDBQuery: { ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }) => ({
            FilterExpression: `twitterScreenName IN (${dynamoDBQuery.ScreenNameFilterExpressionValues.join(', ')}) AND scheduledStatusUpdateId IN (${dynamoDBQuery.ScheduledStatusUpdateIdFilterExpressionValues.join(', ')})`,
            ExpressionAttributeValues: dynamoDBQuery.ExpressionAttributeValues,
          }));
        // run testee
        scanResponse = await documentClient.client
          .scan({
            TableName: integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME,
            FilterExpression,
            ExpressionAttributeValues,
          })
          .promise();
        // store found items
        expect(scanResponse !== undefined).to.be.true;
        expect(scanResponse.Items !== undefined).to.be.true;
        expect(scanResponse.Items instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect((scanResponse.Items as any[]).length === EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH).to.be.true;
        for (const foundItem of scanResponse.Items as any[]) {
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === foundItem.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === foundItem.twitterScreenName) !== undefined,
          ).to.be.true;
        }
        // return explicitly
        return;
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });
  });

  context('existing items', () => {
    beforeEach(async () => {
      try {
        // create mock data
        mockTwitterScheduledStatusUpdates = Array.from({ length: 2 }).map(() => new MockTwitterScheduledStatusUpdate());
        // seed mock data
        const batchWriteRequest = {
          RequestItems: {
            [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledStatusUpdates.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledStatusUpdate>) => {
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
        if (batchWriteResponse.UnprocessedItems && Object.keys(batchWriteResponse.UnprocessedItems).length) throw new Error('Failed to write all items to dynamodb');
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
            [integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: mockTwitterScheduledStatusUpdates.map((mockTwitterScheduledTweet: Partial<MockTwitterScheduledStatusUpdate>) => {
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
        mockTwitterScheduledStatusUpdates = [];
      // return explicitly
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });

    it('- should replace 1...N twitter scheduled statu update instances that already exist and create 1...N twitter scheduled statu update instances that do not already exist', async () => {
      try {
        // get test copy of
        // data used for test
        const testUpdatedMockTwitterScheduledStatusUpdates = mockTwitterScheduledStatusUpdates.slice(0, 2).map((mockTwitterScheduledStatusUpdate: any, index: number) => _.assign(
          {}, mockTwitterScheduledStatusUpdate, { status: `UPDATED ${index}!` },
        ));
        // set expectations
        const EXPECTED_ARRAY_CLASS_INSTANCE = Array;
        const EXPECTED_UNPROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH = 0;
        const EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES = testUpdatedMockTwitterScheduledStatusUpdates.slice(0, testUpdatedMockTwitterScheduledStatusUpdates.length);
        const EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH = EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.length;
        // scan dynamo db to verify
        let [{
          FilterExpression, ExpressionAttributeValues,
        }] = testUpdatedMockTwitterScheduledStatusUpdates
          .reduce(
            (dynamoDBQuery: [{ ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }], testMockTwitterScheduledStatusUpdate: any, index: number) => {
              const screenNameReplacementKey = `:twitterScreenName${index}`;
              const scheduledStatusUpdateIdReplacementKey = `:scheduledStatusUpdateId${index}`;
              dynamoDBQuery[0].ExpressionAttributeValues[screenNameReplacementKey] = testMockTwitterScheduledStatusUpdate.twitterScreenName;
              dynamoDBQuery[0].ExpressionAttributeValues[scheduledStatusUpdateIdReplacementKey] = testMockTwitterScheduledStatusUpdate.scheduledStatusUpdateId;
              dynamoDBQuery[0].ScreenNameFilterExpressionValues.push(screenNameReplacementKey);
              dynamoDBQuery[0].ScheduledStatusUpdateIdFilterExpressionValues.push(scheduledStatusUpdateIdReplacementKey);
              return dynamoDBQuery;
            },
            [{ ExpressionAttributeValues: {}, ScreenNameFilterExpressionValues: [], ScheduledStatusUpdateIdFilterExpressionValues: [] }],
          )
          .map((dynamoDBQuery: { ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }) => ({
            FilterExpression: `twitterScreenName IN (${dynamoDBQuery.ScreenNameFilterExpressionValues.join(', ')}) AND scheduledStatusUpdateId IN (${dynamoDBQuery.ScheduledStatusUpdateIdFilterExpressionValues.join(', ')})`,
            ExpressionAttributeValues: dynamoDBQuery.ExpressionAttributeValues,
          }));
        // query dynamo db
        let scanResponse = await documentClient.client
          .scan({
            TableName: integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME,
            FilterExpression,
            ExpressionAttributeValues,
          })
          .promise();
        // store found items
        expect(scanResponse !== undefined).to.be.true;
        expect(scanResponse.Items !== undefined).to.be.true;
        expect(scanResponse.Items instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect((scanResponse.Items as any[]).length === EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH).to.be.true;
        for (const foundItem of scanResponse.Items as any[]) {
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === foundItem.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === foundItem.twitterScreenName) !== undefined,
          ).to.be.true;
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === foundItem.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === foundItem.twitterScreenName
              && expectedScheduledStatusUpdate.status === foundItem.status) === undefined,
          ).to.be.true;
        }
        // run testee
        const putScheduledStatusUpdatesResponse = await twitterManager.putScheduledStatusUpdates({
          scheduledStatusUpdates: testUpdatedMockTwitterScheduledStatusUpdates.slice(0, testUpdatedMockTwitterScheduledStatusUpdates.length),
        });
        // validate results
        expect(putScheduledStatusUpdatesResponse !== undefined).to.be.true;
        expect(putScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdates !== undefined).to.be.true;
        expect(putScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdates instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect(putScheduledStatusUpdatesResponse.unprocessedScheduledStatusUpdates?.length === EXPECTED_UNPROCCESSED_SCHEDULED_STATUS_UPDATE_KEYS_LENGTH).to.be.true;
        expect(putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates !== undefined).to.be.true;
        expect(putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect(putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates?.length === EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH).to.be.true;
        for (const processedScheduledStatusUpdate of putScheduledStatusUpdatesResponse.processedScheduledStatusUpdates) {
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === processedScheduledStatusUpdate.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === processedScheduledStatusUpdate.twitterScreenName) !== undefined,
          ).to.be.true;
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === processedScheduledStatusUpdate.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === processedScheduledStatusUpdate.twitterScreenName
              && expectedScheduledStatusUpdate.status === processedScheduledStatusUpdate.status) !== undefined,
          ).to.be.true;
        }
        [{
          FilterExpression, ExpressionAttributeValues,
        }] = testUpdatedMockTwitterScheduledStatusUpdates
          .reduce(
            (dynamoDBQuery: [{ ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }], testMockTwitterScheduledStatusUpdate: any, index: number) => {
              const screenNameReplacementKey = `:twitterScreenName${index}`;
              const scheduledStatusUpdateIdReplacementKey = `:scheduledStatusUpdateId${index}`;
              dynamoDBQuery[0].ExpressionAttributeValues[screenNameReplacementKey] = testMockTwitterScheduledStatusUpdate.twitterScreenName;
              dynamoDBQuery[0].ExpressionAttributeValues[scheduledStatusUpdateIdReplacementKey] = testMockTwitterScheduledStatusUpdate.scheduledStatusUpdateId;
              dynamoDBQuery[0].ScreenNameFilterExpressionValues.push(screenNameReplacementKey);
              dynamoDBQuery[0].ScheduledStatusUpdateIdFilterExpressionValues.push(scheduledStatusUpdateIdReplacementKey);
              return dynamoDBQuery;
            },
            [{ ExpressionAttributeValues: {}, ScreenNameFilterExpressionValues: [], ScheduledStatusUpdateIdFilterExpressionValues: [] }],
          )
          .map((dynamoDBQuery: { ScreenNameFilterExpressionValues: string[]; ScheduledStatusUpdateIdFilterExpressionValues: string[]; ExpressionAttributeValues: AnyObject }) => ({
            FilterExpression: `twitterScreenName IN (${dynamoDBQuery.ScreenNameFilterExpressionValues.join(', ')}) AND scheduledStatusUpdateId IN (${dynamoDBQuery.ScheduledStatusUpdateIdFilterExpressionValues.join(', ')})`,
            ExpressionAttributeValues: dynamoDBQuery.ExpressionAttributeValues,
          }));
        // query dynamo db
        scanResponse = await documentClient.client
          .scan({
            TableName: integrationTestEnv.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME,
            FilterExpression,
            ExpressionAttributeValues,
          })
          .promise();
        // store found items
        expect(scanResponse !== undefined).to.be.true;
        expect(scanResponse.Items !== undefined).to.be.true;
        expect(scanResponse.Items instanceof EXPECTED_ARRAY_CLASS_INSTANCE).to.be.true;
        expect((scanResponse.Items as any[]).length === EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES_LENGTH).to.be.true;
        for (const foundItem of scanResponse.Items as any[]) {
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === foundItem.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === foundItem.twitterScreenName) !== undefined,
          ).to.be.true;
          expect(
            EXPECTED_PROCCESSED_SCHEDULED_STATUS_UPDATES.find((expectedScheduledStatusUpdate: any) =>
              expectedScheduledStatusUpdate.scheduledStatusUpdateId === foundItem.scheduledStatusUpdateId
              && expectedScheduledStatusUpdate.twitterScreenName === foundItem.twitterScreenName
              && expectedScheduledStatusUpdate.status === foundItem.status) !== undefined,
          ).to.be.true;
        }
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
