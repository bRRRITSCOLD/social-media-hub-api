import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class SSM {
  public client!: AWS.SSM;

  public init(config: AWS.SSM.Types.ClientConfiguration = {}) {
    // deconstruct for ease
    const {
      credentials,
      region,
      endpoint,
    } = config;
    // create and store client
    this.client = new AWS.SSM(_.omitBy({
      ...config,
      credentials,
      region,
      endpoint,
    }, _.isUndefined));
  }
}
