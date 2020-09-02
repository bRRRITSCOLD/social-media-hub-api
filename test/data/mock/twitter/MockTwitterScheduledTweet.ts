// node_modules
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// models
import { TwitterScheduledTweet, TwitterScheduledTweetInterface } from '../../../../src/models/twitter/TwitterScheduledTweet';

export class MockTwitterScheduledTweet extends TwitterScheduledTweet {
  public constructor() {
    const mockTwitterScheduledTweet: TwitterScheduledTweetInterface = {
      scheduledTweetId: uuid(),
      twitterScreenName: faker.internet.userName(),
      status: faker.lorem.paragraph().slice(0, 250),
      inReplyToStatusId: uuid(),
      autoPopulateReplyMetadata: _.sample([true, false]),
    };
    super(mockTwitterScheduledTweet);
  }
}
