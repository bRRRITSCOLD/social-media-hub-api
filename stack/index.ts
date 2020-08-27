/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
// node_modules
import * as cdk from '@aws-cdk/core';
import * as cdkDynamoDB from '@aws-cdk/aws-dynamodb';

// libraries
import { createAWSAPIGatewayLambdaDynamoDBStack } from './aws';

// create an app
const app = new cdk.App();

// create our stack
const APIGatewayLambdaDynamoDBStack = createAWSAPIGatewayLambdaDynamoDBStack({
  dynamoDBTable: {
    tableName: 'scheduledTwitterTweets',
    partitionKey: {
      name: 'scheduledTweetId',
      type: cdkDynamoDB.AttributeType.STRING,
    },
    sortKey: {
      name: 'twitterScreenName',
      type: cdkDynamoDB.AttributeType.STRING,
    },
  },
});

// init stack
new APIGatewayLambdaDynamoDBStack(app, 'APIGatewayLambdaDynamoDBStack');

// synthesize it
app.synth();
