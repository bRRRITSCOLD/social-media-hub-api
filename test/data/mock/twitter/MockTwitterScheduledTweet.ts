// node_modules
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// models
import { TwitterScheduledStatusUpdate, TwitterScheduledStatusUpdateInterface } from '../../../../src/models/twitter/TwitterSchedulesSatusUpdate';

export class MockTwitterScheduledStatusUpdate extends TwitterScheduledStatusUpdate {
  public constructor() {
    const mockTwitterScheduledTweet: TwitterScheduledStatusUpdateInterface = {
      scheduledStatusUpdateId: uuid(),
      twitterScreenName: faker.internet.userName(),
      status: faker.lorem.paragraph().slice(0, 250),
      inReplyToStatusId: uuid(),
      autoPopulateReplyMetadata: _.sample([true, false]),
    };
    super(mockTwitterScheduledTweet);
  }
}
