import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class DynamoDBStreams {
  public client!: AWS.DynamoDBStreams;

  public init(config: AWS.DynamoDBStreams.Types.ClientConfiguration = {}) {
    // deconstruct for ease
    const {
      credentials,
      region,
      endpoint,
    } = config;
    // create and store client
    this.client = new AWS.DynamoDBStreams(_.omitBy({
      ...config,
      credentials,
      region,
      endpoint,
    }, _.isUndefined));
  }
}
