import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class CloudWatchEvents {
  public client!: AWS.CloudWatchEvents;

  public init(config: AWS.CloudWatchEvents.Types.ClientConfiguration = {}) {
    // deconstruct for ease
    const {
      credentials,
      region,
      endpoint,
    } = config;
    // create and store client
    this.client = new AWS.CloudWatchEvents(_.omitBy({
      ...config,
      credentials,
      region,
      endpoint,
    }, _.isUndefined));
  }
}
