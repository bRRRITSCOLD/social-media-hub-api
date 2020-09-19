/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
// node_modules
import * as cdk from '@aws-cdk/core';
import * as cdkDynamoDB from '@aws-cdk/aws-dynamodb';

// libraries
import { createAWSAPIGatewayLambdaDynamoDBsStack } from './aws';

// create an app
const app = new cdk.App();

// create our stack
const APIGatewayLambdaDynamoDBsStack = createAWSAPIGatewayLambdaDynamoDBsStack({
  dynamoDBTables: [
    {
      tableName: 'scheduledTwitterStatusUpdates',
      partitionKey: {
        name: 'scheduledStatusUpdateId',
        type: cdkDynamoDB.AttributeType.STRING,
      },
      sortKey: {
        name: 'twitterScreenName',
        type: cdkDynamoDB.AttributeType.STRING,
      },
    },
  ],
});

// init stack
new APIGatewayLambdaDynamoDBsStack(app, 'SocialMediaHubAWSStack');

// // synthesize it
// app.synth();
