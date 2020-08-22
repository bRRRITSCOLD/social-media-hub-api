// node_modules
import { Service } from 'typedi';
import * as _ from 'lodash';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import * as cryptography from '../../../lib/cryptography';

// models
import { APIError } from '../../../models/error';
import { UserTokenTypeEnum } from '../../../models/user-token';

// models
import * as userManager from '../../../data-management/user';
import * as userTokenManager from '../../../data-management/user-token';
import * as twitterManager from '../../../data-management/twitter';

@Service()
export class TwitterStatusService {
  public async statusUpdate(
    data: {
      userId: string;
      status: string;
      inReplyToStatusId?: string;
      autoPopulateReplyMetadata?: boolean;
    },
  ): Promise<any> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#userTimeline::initiating execution');
      // deconstruct for ease
      const {
        userId,
        status,
        inReplyToStatusId,
        autoPopulateReplyMetadata,
      } = data;
      // query for the user that is attempting to
      // get the oauth request token for twitter
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { userId },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: {
            userId,
            type: UserTokenTypeEnum.TWITTER,
          },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
      ]);
      // if no user throw error
      if (!existingUser) throw new APIError(
        new Error('No user found.'),
        { statusCode: 404 },
      );
      // if no existing twitter user token
      if (!existingUserToken) throw new APIError(
        new Error('No twitter user token found.'),
        { statusCode: 404 },
      );
      // get to get twitter access tokens and
      // additional information
      const postStatusUpdateResponse = await twitterManager.postStatusUpdate({
        oAuthAccessToken: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessToken', '')),
        oAuthAccessTokenSecret: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessTokenSecret', '')),
        status,
        inReplyToStatusId,
        autoPopulateReplyMetadata,
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#userTimeline::successfully executed');
      // return resulst explicitly
      return postStatusUpdateResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterService::#userTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
