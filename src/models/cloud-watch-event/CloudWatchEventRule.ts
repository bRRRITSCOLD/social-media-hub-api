// node_modules
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';
import { CloudWatchEventRuleTag, CloudWatchEventRuleTagInterface, cloudWatchEventRuleTagSchema } from './CloudWatchEventRuleTag';

// libraries

/**
 *
 *
 * @export
 * @interface UserInterface
 */
export interface CloudWatchEventRuleInterface {
  name: string;
  scheduleExpression?: string;
  eventPattern?: string;
  state?: string;
  description?: string;
  roleArn?: string;
  tags?: CloudWatchEventRuleTagInterface[];
  eventBusName?: string;
}

const cloudWatchEventRuleSchema: yup.ObjectSchema<any> = yup.object().shape({
  name: yup
    .string()
    .label('Name')
    .required(),
  scheduleExpression: yup
    .string()
    .label('Scgeduled Expression')
    .optional(),
  eventPattern: yup
    .string()
    .label('Event Pattern')
    .optional(),
  state: yup
    .string()
    .label('State')
    .optional(),
  description: yup
    .string()
    .label('Description')
    .optional(),
  roleArn: yup
    .string()
    .label('Role ARN')
    .optional(),
  tags: yup
    .array()
    .label('Tags')
    .of(cloudWatchEventRuleTagSchema)
    .optional(),
  eventBusName: yup
    .string()
    .label('Event Bus Name')
    .optional(),
});

/**
 *
 *
 * @export
 * @class User
 * @implements {UserInterface}
 */
export class CloudWatchEventRule implements CloudWatchEventRuleInterface {
  public name!: string;
  public scheduleExpression?: string;
  public eventPattern?: string;
  public state?: string;
  public description?: string;
  public roleArn?: string;
  public tags?: CloudWatchEventRuleTag[];
  public eventBusName?: string;

  /**
   *Creates an instance of User.
   * @param {Partial<UserInterface>} user
   * @memberof User
   */
  public constructor(eventBridgeRule: Partial<CloudWatchEventRuleInterface>) {
    _.assign(this, {
      ...eventBridgeRule,
      name: _.get(eventBridgeRule, 'name'),
      scheduleExpression: _.get(eventBridgeRule, 'scheduleExpression'),
      eventPattern: _.get(eventBridgeRule, 'eventPattern'),
      state: _.get(eventBridgeRule, 'state'),
      description: _.get(eventBridgeRule, 'description'),
      roleArn: _.get(eventBridgeRule, 'roleArn'),
      tags: _.get(eventBridgeRule, 'tags', [] as CloudWatchEventRuleTagInterface[])
        .map((eventBridgeRuleTag: CloudWatchEventRuleTagInterface) => new CloudWatchEventRuleTag(
          eventBridgeRuleTag,
        )),
      eventBusName: _.get(eventBridgeRule, 'eventBusName'),
    });
  }

  /**
   *
   *
   * @returns {({ value: User | undefined; error: Error | yup.ValidationError | undefined })}
   * @memberof User
   */
  public validate(): { value: CloudWatchEventRule | undefined; error: Error | yup.ValidationError | undefined } {
    try {
      let validationError;
      let validationValue: CloudWatchEventRule | undefined;
      try {
        validationValue = new CloudWatchEventRule(cloudWatchEventRuleSchema.validateSync(
          _.assign({}, this),
          { strict: true },
        ));
      } catch (err) {
        validationError = err;
      }
      return { value: validationValue, error: validationError };
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   *
   * @returns {Promise<any>}
   * @memberof User
   */
  public async validateAsync(): Promise<{ value: CloudWatchEventRule | undefined; error: Error | yup.ValidationError | undefined }> {
    try {
      let validationError;
      let validationValue: CloudWatchEventRule | undefined;
      try {
        validationValue = new CloudWatchEventRule(await cloudWatchEventRuleSchema.validate(
          _.assign({}, this),
          { strict: true },
        ));
      } catch (err) {
        validationError = err;
      }
      return { value: validationValue, error: validationError };
    } catch (err) {
      throw err;
    }
  }
}
