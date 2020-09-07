// node_modules
import * as _ from 'lodash';
import { documentClient } from '../../lib/aws';
import { env } from '../../lib/environment';

// models
import { TwitterScheduledStatusUpdate, TwitterScheduledStatusUpdateInterface } from '../../models';

export interface PutScheduledStatusUpdatesRequestInterface {
  scheduledStatusUpdates: Partial<TwitterScheduledStatusUpdateInterface>[];
}

export interface PutScheduledStatusUpdatesResponseInterface {
  processedScheduledStatusUpdates: TwitterScheduledStatusUpdateInterface[];
  unprocessedScheduledStatusUpdates?: TwitterScheduledStatusUpdateInterface[];
}

export async function putScheduledStatusUpdates(
  putScheduledStatusUpdatesRequest: PutScheduledStatusUpdatesRequestInterface,
): Promise<PutScheduledStatusUpdatesResponseInterface> {
  try {
    // deconstruct for eas
    const { scheduledStatusUpdates } = putScheduledStatusUpdatesRequest;
    // validate the incoming data
    const newScheduledStatusUpdates = await Promise.all(
      scheduledStatusUpdates.map(async (scheduledStatusUpdate: Partial<TwitterScheduledStatusUpdateInterface>) => {
        const newScheduledStatusUpdate = new TwitterScheduledStatusUpdate(scheduledStatusUpdate);
        const validation = await newScheduledStatusUpdate.validateAsync();
        if (validation.error) throw validation.error;
        return newScheduledStatusUpdate;
      }),
    );
    // create request
    const batchWriteRequest = {
      RequestItems: {
        [env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]: newScheduledStatusUpdates.map((scheduledStatusUpdate: {
          scheduledStatusUpdateId: string;
          twitterScreenName: string;
        }) => {
          return {
            PutRequest: {
              Item: _.assign(
                {},
                scheduledStatusUpdate,
              ),
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
      processedScheduledStatusUpdates: newScheduledStatusUpdates.reduce((processedScheduledStatusUpdates: TwitterScheduledStatusUpdateInterface[], scheduledStatusUpdate: TwitterScheduledStatusUpdateInterface) => {
        const unprocessedScheduledStatusUpdateKey = _.get(batchWriteResponse, 'UnprocessedItems[env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME]', []).find((writeRequest: any) =>
          _.get(writeRequest, 'PutRequest.Item.scheduledStatusUpdateId') === scheduledStatusUpdate.scheduledStatusUpdateId
          && _.get(writeRequest, 'PutRequest.Item.twitterScreenName') === scheduledStatusUpdate.twitterScreenName);
        if (!unprocessedScheduledStatusUpdateKey) {
          processedScheduledStatusUpdates.push(_.assign({}, scheduledStatusUpdate));
        }
        return processedScheduledStatusUpdates;
      }, [])
        .map((processedScheduledStatusUpdate: TwitterScheduledStatusUpdateInterface) => new TwitterScheduledStatusUpdate(processedScheduledStatusUpdate)),
      unprocessedScheduledStatusUpdates: _.get(batchWriteResponse, `UnprocessedItems[${env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME}]`, []).map((writeRequest: any) =>
        _.assign(
          {},
          _.get(writeRequest, 'PutRequest.Item', {}),
        ))
        .map((unprocessedScheduledStatusUpdate: TwitterScheduledStatusUpdateInterface) => new TwitterScheduledStatusUpdate(unprocessedScheduledStatusUpdate)),
    };
  } catch (err) {
    throw err;
  }
}
