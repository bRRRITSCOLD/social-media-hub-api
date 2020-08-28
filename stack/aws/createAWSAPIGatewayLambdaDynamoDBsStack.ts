/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
// node_modules
import * as cdk from '@aws-cdk/core';

import { createDynamoDBTable, CreateDynamoDBTableRequestInterface } from './dynamo-db';

export interface CreateAWSAPIGatewayLambdaDynamoDBsStackStackRequestInterface {
  dynamoDBTables: Partial<CreateDynamoDBTableRequestInterface>[];
}

export const createdTables: any[] = [];

export function createAWSAPIGatewayLambdaDynamoDBsStack(createAWSAPIGatewayLambdaDynamoDBsStackStackRequest: CreateAWSAPIGatewayLambdaDynamoDBsStackStackRequestInterface) {
  try {
    // deconstruct for ease
    const {
      dynamoDBTables,
    } = createAWSAPIGatewayLambdaDynamoDBsStackStackRequest;
    // create our stack
    return class APIGatewayLambdaDynamoDBStack extends cdk.Stack {
      constructor(app: cdk.App, id: string) {
        super(app, id);
        // create the tables
        const createdDynamoDBTables = dynamoDBTables.reduce((crtdTbls: any[], dynamoDBTable: any) => {
          const createDynamoDBTableResponse = createDynamoDBTable({
            ...dynamoDBTable,
            stack: this,
          } as CreateDynamoDBTableRequestInterface);
          crtdTbls.push(createDynamoDBTableResponse.dynamoDBTable);
          return crtdTbls;
        }, []);
      }
    };
  } catch (err) {
    throw err;
  }
}
