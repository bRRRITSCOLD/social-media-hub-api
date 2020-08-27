/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
// node_modules
import * as cdk from '@aws-cdk/core';

import { createDynamoDBTable, CreateDynamoDBTableRequestInterface } from './dynamo-db';

export interface CreateAWSAPIGatewayLambdaDynamoDBStackRequestInterface {
  dynamoDBTable: Partial<CreateDynamoDBTableRequestInterface>;
}

export function createAWSAPIGatewayLambdaDynamoDBStack(createAWSAPIGatewayLambdaDynamoDBStackRequest: CreateAWSAPIGatewayLambdaDynamoDBStackRequestInterface) {
  try {
    // deconstruct for ease
    const {
      dynamoDBTable,
    } = createAWSAPIGatewayLambdaDynamoDBStackRequest;
    // create our stack
    return class APIGatewayLambdaDynamoDBStack extends cdk.Stack {
      constructor(app: cdk.App, id: string) {
        super(app, id);
        const [
          { dynamoDBTable: createdDynamoDBTable },
        ] = [
          createDynamoDBTable({
            ...dynamoDBTable,
            stack: app,
          } as CreateDynamoDBTableRequestInterface),
        ];
      }
    };
  } catch (err) {
    throw err;
  }
}
