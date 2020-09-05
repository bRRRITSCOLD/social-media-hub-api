import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';

export interface TwitterScheduledStatusUpdateInterface {
  twitterScreenName: string;
  scheduledStatusUpdateId: string;
  status: string;
  inReplyToStatusId?: string;
  autoPopulateReplyMetadata?: boolean;
}

const twitterScheduledStatusUpdateSchema: yup.ObjectSchema<any> = yup.object().shape({
  twitterScreenName: yup
    .string()
    .label('Twitter Screen Name')
    .required(),
  scheduledStatusUpdateId: yup
    .string()
    .label('Scheduled Status Update ID')
    .required(),
  status: yup
    .string()
    .label('Status')
    .required(),
  inReplyToStatusId: yup
    .string()
    .label('In Reply to Status ID')
    .required(),
  password: yup
    .string()
    .label('Auto Populate Reply Metadata')
    .required(),
});

export class TwitterScheduledStatusUpdate implements TwitterScheduledStatusUpdateInterface {
  public twitterScreenName!: string;
  public scheduledStatusUpdateId!: string;
  public status!: string;
  public inReplyToStatusId?: string;
  public autoPopulateReplyMetadata?: boolean;

  public constructor(twitterScheduledStatusUpdate: Partial<TwitterScheduledStatusUpdateInterface>) {
    _.assign(this, twitterScheduledStatusUpdate, {
      twitterScreenName: _.get(twitterScheduledStatusUpdate, 'twitterScreenName'),
      scheduledStatusUpdateId: _.get(twitterScheduledStatusUpdate, 'scheduledStatusUpdateId'),
      status: _.get(twitterScheduledStatusUpdate, 'status'),
      inReplyToStatusId: _.get(twitterScheduledStatusUpdate, 'inReplyToStatusId'),
      autoPopulateReplyMetadata: _.get(twitterScheduledStatusUpdate, 'autoPopulateReplyMetadata'),
    });
  }

  /**
   *
   *
   * @returns {({ value: TwitterScheduledStatusUpdate | undefined; error: Error | yup.ValidationError | undefined })}
   * @memberof TwitterScheduledStatusUpdate
   */
  public validate(): { value: TwitterScheduledStatusUpdate | undefined; error: Error | yup.ValidationError | undefined } {
    try {
      let validationError;
      let validationValue: TwitterScheduledStatusUpdate | undefined;
      try {
        validationValue = new TwitterScheduledStatusUpdate(twitterScheduledStatusUpdateSchema.validateSync(
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
   * @returns {(Promise<{ value: TwitterScheduledStatusUpdate | undefined; error: Error | yup.ValidationError | undefined }>)}
   * @memberof TwitterScheduledStatusUpdate
   */
  public async validateAsync(): Promise<{ value: TwitterScheduledStatusUpdate | undefined; error: Error | yup.ValidationError | undefined }> {
    try {
      let validationError;
      let validationValue: TwitterScheduledStatusUpdate | undefined;
      try {
        validationValue = new TwitterScheduledStatusUpdate(await twitterScheduledStatusUpdateSchema.validate(
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
