// node_modules
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';

// libraries

/**
 *
 *
 * @export
 * @interface UserInterface
 */
export interface CloudWatchEventRuleTagInterface {
  key: string;
  value: string;
}

export const cloudWatchEventRuleTagSchema: yup.ObjectSchema<any> = yup.object().shape({
  key: yup
    .string()
    .label('kEY')
    .required(),
  value: yup
    .string()
    .label('Value')
    .required(),
});

export class CloudWatchEventRuleTag implements CloudWatchEventRuleTagInterface {
  public key!: string;
  public value!: string;

  /**
   *Creates an instance of User.
   * @param {Partial<UserInterface>} user
   * @memberof User
   */
  public constructor(eventBridgeRuleTag: Partial<CloudWatchEventRuleTagInterface>) {
    _.assign(this, {
      ...eventBridgeRuleTag,
      key: _.get(eventBridgeRuleTag, 'key'),
      value: _.get(eventBridgeRuleTag, 'value'),
    });
  }

  /**
   *
   *
   * @returns {({ value: User | undefined; error: Error | yup.ValidationError | undefined })}
   * @memberof User
   */
  public validate(): { value: CloudWatchEventRuleTag | undefined; error: Error | yup.ValidationError | undefined } {
    try {
      let validationError;
      let validationValue: CloudWatchEventRuleTag | undefined;
      try {
        validationValue = new CloudWatchEventRuleTag(cloudWatchEventRuleTagSchema.validateSync(
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
  public async validateAsync(): Promise<{ value: CloudWatchEventRuleTag | undefined; error: Error | yup.ValidationError | undefined }> {
    try {
      let validationError;
      let validationValue: CloudWatchEventRuleTag | undefined;
      try {
        validationValue = new CloudWatchEventRuleTag(await cloudWatchEventRuleTagSchema.validate(
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
