import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';

export interface TwitterScheduledTweetInterface {
  twitterScreenName: string;
  scheduledTweetId: string;
  status: string;
  inReplyToStatusId?: string;
  autoPopulateReplyMetadata?: boolean;
}

const twitterScheduledTweetSchema: yup.ObjectSchema<any> = yup.object().shape({
  twitterScreenName: yup
    .string()
    .label('Twitter Screen Name')
    .required(),
  scheduledTweetId: yup
    .string()
    .label('Scheduled Tweet ID')
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

export class TwitterScheduledTweet implements TwitterScheduledTweetInterface {
  public twitterScreenName!: string;
  public scheduledTweetId!: string;
  public status!: string;
  public inReplyToStatusId?: string;
  public autoPopulateReplyMetadata?: boolean;

  public constructor(twitterScheduledTweet: Partial<TwitterScheduledTweetInterface>) {
    _.assign(this, twitterScheduledTweet, {
      twitterScreenName: _.get(twitterScheduledTweet, 'twitterScreenName'),
      scheduledTweetId: _.get(twitterScheduledTweet, 'scheduledTweetId'),
      status: _.get(twitterScheduledTweet, 'status'),
      inReplyToStatusId: _.get(twitterScheduledTweet, 'inReplyToStatusId'),
      autoPopulateReplyMetadata: _.get(twitterScheduledTweet, 'autoPopulateReplyMetadata'),
    });
  }

  /**
   *
   *
   * @return {*}  {({ value: TwitterScheduledTweet | undefined; error: Error | yup.ValidationError | undefined })}
   * @memberof TwitterScheduledTweet
   */
  public validate(): { value: TwitterScheduledTweet | undefined; error: Error | yup.ValidationError | undefined } {
    try {
      let validationError;
      let validationValue: TwitterScheduledTweet | undefined;
      try {
        validationValue = new TwitterScheduledTweet(twitterScheduledTweetSchema.validateSync(
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
   * @return {*}  {(Promise<{ value: TwitterScheduledTweet | undefined; error: Error | yup.ValidationError | undefined }>)}
   * @memberof TwitterScheduledTweet
   */
  public async validateAsync(): Promise<{ value: TwitterScheduledTweet | undefined; error: Error | yup.ValidationError | undefined }> {
    try {
      let validationError;
      let validationValue: TwitterScheduledTweet | undefined;
      try {
        validationValue = new TwitterScheduledTweet(await twitterScheduledTweetSchema.validate(
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
