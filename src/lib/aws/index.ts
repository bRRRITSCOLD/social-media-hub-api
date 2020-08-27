import { DocumentClient } from './DocumentClient';
import { DynamoDB } from './DynamoDB';
import { DynamoDBStreams } from './DynamoDBStreams';
import { SSM } from './SSM';

const documentClient = new DocumentClient();
const dynamoDB = new DynamoDB();
const dynamoDBStreams = new DynamoDBStreams();
const ssm = new SSM();

export {
  documentClient, dynamoDB, dynamoDBStreams, ssm,
};
