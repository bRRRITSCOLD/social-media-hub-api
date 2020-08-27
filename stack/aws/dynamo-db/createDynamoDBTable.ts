// node_modules
import * as _ from 'lodash';
import cdk = require('@aws-cdk/core');
import dynamoDB = require('@aws-cdk/aws-dynamoDB');
import kms = require('@aws-cdk/aws-kms');

export interface CreateDynamoDBTableRequestInterface {
  stack: cdk.Construct;
  readonly tableName: string;
  readonly partitionKey: dynamoDB.Attribute;
  readonly sortKey?: dynamoDB.Attribute;
  readonly readCapacity?: number;
  readonly writeCapacity?: number;
  readonly billingMode?: dynamoDB.BillingMode;
  readonly pointInTimeRecovery?: boolean;
  readonly serverSideEncryption?: boolean;
  readonly encryption?: dynamoDB.TableEncryption;
  readonly encryptionKey?: kms.IKey;
  readonly timeToLiveAttribute?: string;
  readonly stream?: dynamoDB.StreamViewType;
  readonly removalPolicy?: cdk.RemovalPolicy;
  readonly replicationRegions?: string[];
  readonly globalSecondaryIndexes?: dynamoDB.GlobalSecondaryIndexProps[];
  readonly localSecondaryIndexes?: dynamoDB.LocalSecondaryIndexProps[];
}

export interface CreateDynamoDBTableResponseInterface {
  dynamoDBTable: dynamoDB.Table;
}

export function createDynamoDBTable(
  createDynamoDBTableRequest: CreateDynamoDBTableRequestInterface,
): CreateDynamoDBTableResponseInterface {
  try {
    // deconstruct for ease
    const {
      stack,
      tableName,
      partitionKey,
      sortKey,
      readCapacity,
      writeCapacity,
      billingMode,
      pointInTimeRecovery,
      serverSideEncryption,
      encryption,
      encryptionKey,
      timeToLiveAttribute,
      stream,
      removalPolicy,
      replicationRegions,
      globalSecondaryIndexes,
      localSecondaryIndexes,
    } = createDynamoDBTableRequest;
    // build the table
    const dynamoDBTable = new dynamoDB.Table(stack, tableName, {
      partitionKey,
      sortKey,
      readCapacity,
      writeCapacity,
      billingMode,
      pointInTimeRecovery,
      serverSideEncryption,
      encryption,
      encryptionKey,
      timeToLiveAttribute,
      stream,
      removalPolicy,
      replicationRegions,
      tableName,
    });
    // if we global secondary indexes then add them
    if (globalSecondaryIndexes) globalSecondaryIndexes.reduce((__: undefined, globalSecondaryIndex: dynamoDB.GlobalSecondaryIndexProps) => {
      dynamoDBTable.addGlobalSecondaryIndex(globalSecondaryIndex);
      return __;
    }, undefined);
    // if we local secondary indexes then add them
    if (localSecondaryIndexes) localSecondaryIndexes.reduce((__: undefined, localSecondaryIndex: dynamoDB.LocalSecondaryIndexProps) => {
      dynamoDBTable.addLocalSecondaryIndex(localSecondaryIndex);
      return __;
    }, undefined);
    // return explicitly
    return {
      dynamoDBTable,
    };
  } catch (err) {
    throw err;
  }
}
