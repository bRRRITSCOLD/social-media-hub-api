import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class DocumentClient {
  public client!: AWS.DynamoDB.DocumentClient;

  public init(config: AWS.DynamoDB.DocumentClient.DocumentClientOptions & AWS.DynamoDB.Types.ClientConfiguration = {}) {
    // deconstruct for ease
    const {
      credentials,
      region,
      endpoint,
    } = config;
    // create and store client
    this.client = new AWS.DynamoDB.DocumentClient(_.omitBy({
      ...config,
      credentials,
      region,
      endpoint,
    }, _.isUndefined));
  }
}
