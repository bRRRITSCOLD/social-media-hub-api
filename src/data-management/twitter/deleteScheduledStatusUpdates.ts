// node_modules
import * as _ from 'lodash';

// libraries
import { documentClient } from '../../lib/aws';
import { env } from '../../lib/environment';

export interface TwitterScheduledStatusUpdateKeysInterface {
  scheduledStatusUpdateId: string;
  twitterScreenName: string;
}

export interface DeleteScheduledStatusUpdatesRequestInterface {
  scheduledStatusUpdateKeys: TwitterScheduledStatusUpdateKeysInterface[];
}

export interface DeleteScheduledStatusUpdatesResponseInterface {
  processedScheduledStatusUpdateKeys: TwitterScheduledStatusUpdateKeysInterface[];
  unprocessedScheduledStatusUpdateKeys?: TwitterScheduledStatusUpdateKeysInterface[];
}

export async function deleteScheduledStatusUpdates(
  deleteScheduledStatusUpdatesRequest: DeleteScheduledStatusUpdatesRequestInterface,
): Promise<DeleteScheduledStatusUpdatesResponseInterface> {
  try {
    // deconstruct for eas
    const { scheduledStatusUpdateKeys } = deleteScheduledStatusUpdatesRequest;
    // create request
    const batchWriteRequest = {
      RequestItems: {
        [env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: scheduledStatusUpdateKeys.map((scheduledStatusUpdateKey: {
          scheduledStatusUpdateId: string;
          twitterScreenName: string;
        }) => {
          return {
            DeleteRequest: {
              Key: {
                scheduledStatusUpdateId: scheduledStatusUpdateKey.scheduledStatusUpdateId,
                twitterScreenName: scheduledStatusUpdateKey.twitterScreenName,
              },
            },
          };
        }),
      },
    };
    // operate against dynamo db
    const batchWriteResponse = await documentClient.client
      .batchWrite(batchWriteRequest)
      .promise();
    // create response
    // return explicitly
    return {
      processedScheduledStatusUpdateKeys: scheduledStatusUpdateKeys.reduce((processedScheduledStatusUpdateKeys: TwitterScheduledStatusUpdateKeysInterface[], scheduledStatusUpdateKey: TwitterScheduledStatusUpdateKeysInterface) => {
        const unprocessedScheduledStatusUpdateKey = _.get(batchWriteResponse, 'UnprocessedItems[env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]', []).find((writeRequest: any) =>
          _.get(writeRequest, 'DeleteRequest.Key.scheduledStatusUpdateId') === scheduledStatusUpdateKey.scheduledStatusUpdateId
          && _.get(writeRequest, 'DeleteRequest.Key.twitterScreenName') === scheduledStatusUpdateKey.twitterScreenName);
        if (!unprocessedScheduledStatusUpdateKey) {
          processedScheduledStatusUpdateKeys.push(scheduledStatusUpdateKey);
        }
        return processedScheduledStatusUpdateKeys;
      }, []),
      unprocessedScheduledStatusUpdateKeys: _.get(batchWriteResponse, `UnprocessedItems[${env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME}]`, []).map((writeRequest: any) => ({
        scheduledStatusUpdateId: _.get(writeRequest, 'DeleteRequest.Key.scheduledStatusUpdateId'),
        twitterScreenName: _.get(writeRequest, 'DeleteRequest.Key.twitterScreenName'),
      })),
    };
  } catch (err) {
    throw err;
  }
}
