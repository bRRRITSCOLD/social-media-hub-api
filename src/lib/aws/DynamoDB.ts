import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class DynamoDB {
  public client!: AWS.DynamoDB;

  public init(config: AWS.DynamoDB.Types.ClientConfiguration = {}) {
    // deconstruct for ease
    const {
      credentials,
      region,
      endpoint,
    } = config;
    // create and store client
    this.client = new AWS.DynamoDB(_.omitBy({
      ...config,
      credentials,
      region,
      endpoint,
    }, _.isUndefined));
  }
}
