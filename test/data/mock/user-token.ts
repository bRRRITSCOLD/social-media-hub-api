// node_modules
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import { testUtils } from '../../lib';

// models
import {
  UserToken, UserTokenInterface, UserTokenTypeEnum,
} from '../../../src/models/user-token';

export class MockUserToken extends UserToken {
  public constructor() {
    const mockUserToken: UserTokenInterface = {
      tokenId: uuid(),
      userId: uuid(),
      type: _.sample([...testUtils.enumerations.enumerate(UserTokenTypeEnum)]),
      oAuthAccessToken: uuid(),
      oAuthAccessTokenSecret: uuid(),
    };
    super(mockUserToken);
  }
}
