// node_modules
import * as _ from 'lodash';

// libraries
import { utils } from '../../lib/utils';
import { logger } from '../../lib/logger';
import { cloudWatchEvents } from '../../lib/aws';

// models
import { APIError } from '../../models/error';
import { CloudWatchEventRule } from '../../models';

export interface PutRuleRequestInterface {
  name: string;
  scheduleExpression?: string;
  eventPattern?: string;
  state?: string;
  description?: string;
  roleArn?: string;
  tags?: {
    key: string;
    value: string;
  }[];
  eventBusName?: string;
}

export interface PutRuleResponseInterface {
  ruleArn?: string;
}

export async function putRule(putRuleRequest: PutRuleRequestInterface): Promise<PutRuleResponseInterface> {
  try {
    // deconstruct for ease
    const {
      name,
      scheduleExpression,
      eventPattern,
      state,
      description,
      roleArn,
      tags,
      eventBusName,
    } = putRuleRequest;
    // create new CloudWatchEventRule instance
    const newCloudWatchEventRule = new CloudWatchEventRule({
      name,
      scheduleExpression,
      eventPattern,
      state,
      description,
      roleArn,
      tags,
      eventBusName,
    });
    // validate new CloudWatchEventRule instance
    const validation = await newCloudWatchEventRule.validateAsync();
    // if there were validation errors then
    // we want to throw now (early)
    if (validation.error) throw new APIError(
      validation.error,
      { statusCode: 400 },
    );
    // convert request into object
    // with PascalCase keys
    const pascalCaseRequest = utils.objects.pascalCaseKeys(
      _.omitBy(
        _.assign({}, newCloudWatchEventRule),
        _.isUndefined,
      ),
    );
    // call aws and get a list of all the
    // current cloud watch event rules
    const putRuleResponse = await cloudWatchEvents.client?.putRule(pascalCaseRequest).promise();
    // convert the response into
    // object with camelCase property keys
    const camelCaseResponse = utils.objects.camelCaseKeys(putRuleResponse);
    // return explcitly
    return {
      ruleArn: camelCaseResponse.ruleArn,
    };
  } catch (err) {
    // build error
    const error = new APIError(err);
    // throw error explicitly
    throw error;
  }
}
