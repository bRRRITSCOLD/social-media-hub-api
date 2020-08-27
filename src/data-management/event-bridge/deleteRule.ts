// node_modules
import * as _ from 'lodash';

// libraries
import { utils } from '../../lib/utils';
import { cloudWatchEvents } from '../../lib/aws';

// models
import { APIError } from '../../models/error';

export interface DeleteRuleRequestInterface {
  name: string;
  eventBusName?: string;
  force?: boolean;
}

export async function deleteRule(deleteRuleRequest: DeleteRuleRequestInterface): Promise<boolean> {
  try {
    // deconstruct for ease
    const {
      name,
      force,
      eventBusName,
    } = deleteRuleRequest;
    // convert request into object
    // with PascalCase keys
    const pascalCaseRequest = utils.objects.pascalCaseKeys(
      _.omitBy(
        _.assign({}, {
          name,
          force,
          eventBusName,
        }),
        _.isUndefined,
      ),
    );
    // call aws and get a list of all the
    // current cloud watch event rules
    await cloudWatchEvents.client?.deleteRule(pascalCaseRequest).promise();
    // return explcitly
    return true;
  } catch (err) {
    // build error
    const error = new APIError(err);
    // throw error explicitly
    throw error;
  }
}
