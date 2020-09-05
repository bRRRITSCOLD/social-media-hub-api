// node_modules
import * as _ from 'lodash';
import { documentClient } from '../../lib/aws';
import { env } from '../../lib/environment';
import { AnyObject } from '../../models';
import { TwitterScheduledStatusUpdateInterface } from '../../models/twitter/TwitterSchedulesSatusUpdate';

export interface SearchScheduledStatusUpdatesRequestInterface {
  searchCriteria: {
    twitterScreenName?: string | string[];
    twitterUserId?: string | string[];
    status?: string | string[];
    inReplyToStatusId?: string | string[];
    autoPopulateReplyMetadata?: boolean;
  };
  searchOptions: {
    limit?: number
    exclusiveStartKey?: AnyObject;
  };
}

// export interface SearchScheduledStatusUpdatesResponseInterface {
//   scheduledStatusUpdates: TwitterScheduledTweetInterface[];
//   exclusiveStartKey?: AnyObject;
// }

export async function searchScheduledStatusUpdates(searchSchedulesStatusUpdatesRequest: SearchScheduledStatusUpdatesRequestInterface) {
  try {
    // deconstruct for eas
    const { searchCriteria, searchOptions } = searchSchedulesStatusUpdatesRequest;
    const [limit, exclusiveStartKey] = [_.get(searchOptions, 'limit', 500), _.get(searchOptions, 'exclusiveStartKey')];
    const items = [];
    // build query string and replacements
    const [{
      FilterExpression, ExpressionAttributeValues, Limit, ExclusiveStartKey,
    }] = Object.keys(searchCriteria)
      .reduce(
        (dynamoDBQuery: [{ FilterExpression: string[]; ExpressionAttributeValues: AnyObject }], key: string) => {
          let index = 0;
          const replacementKeys: string[] = [];
          (Array.isArray((searchCriteria as any)[key]) ? (searchCriteria as any)[key] : [(searchCriteria as any)[key]]).forEach((
            value: any,
          ) => {
            index++;
            const replacementKey = `:${key}${index}`;
            replacementKeys.push(replacementKey);
            dynamoDBQuery[0].ExpressionAttributeValues[`${replacementKey}`] = value;
          });
          dynamoDBQuery[0].FilterExpression.push(`${key} IN (${replacementKeys.join(', ')})`);
          return dynamoDBQuery;
        },
        [{ ExpressionAttributeValues: {}, FilterExpression: [] }],
      )
      .map((dynamoDBQuery: { FilterExpression: string[]; ExpressionAttributeValues: AnyObject }) => ({
        FilterExpression: dynamoDBQuery.FilterExpression.join(' AND '),
        ExpressionAttributeValues: dynamoDBQuery.ExpressionAttributeValues,
        Limit: limit,
        ExclusiveStartKey: exclusiveStartKey,
      }));
    // query dynamo db
    const scanResponse = await documentClient.client
      .scan({
        TableName: env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME,
        FilterExpression,
        ExpressionAttributeValues,
        Limit,
        ExclusiveStartKey,
      })
      .promise();
    // store found items
    items.push(...(scanResponse.Items as any));
    // return explicitly
    return {
      scheduledStatusUpdates: (_.get(scanResponse, 'Items', [] as any[]) as any[]).map(
        (item: TwitterScheduledStatusUpdateInterface) =>
          _.assign({}, item),
      ),
      exclusiveStartKey: _.get(scanResponse, 'LastEvaluatedKey') as any,
    };
  } catch (err) {
    throw err;
  }
}
