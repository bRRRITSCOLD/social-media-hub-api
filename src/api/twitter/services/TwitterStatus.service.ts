// node_modules
import { Service } from 'typedi';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';

// models
import { APIError } from '../../../models/error';
import { UserTokenTypeEnum } from '../../../models/user-token';

// models
import * as userManager from '../../../data-management/user';
import * as userTokenManager from '../../../data-management/user-token';
import * as twitterManager from '../../../data-management/twitter';
import { cryptography } from '../../../lib';

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
      logger.info('{}TwitterStatusService::#userTimeline::initiating execution');
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
      const postStatusUpdateResponse = await twitterManager.putScheduledStatusUpdates({
        scheduledStatusUpdates: [
          {
            scheduledStatusUpdateId: '',
            twitterScreenName: existingUserToken.twitterScreenName as string,
            status,
            inReplyToStatusId,
            autoPopulateReplyMetadata,
          },
        ],
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#userTimeline::successfully executed');
      // return resulst explicitly
      return postStatusUpdateResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterStatusService::#userTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async scheduleStatusUpdate(
    data: {
      userId: string;
      status: string;
      inReplyToStatusId?: string;
      autoPopulateReplyMetadata?: boolean;
    },
  ): Promise<any> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#scheduleStatusUpdate::initiating execution');
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
      // verify the users credentials for twitter
      await twitterManager.getAccountCredentialsVerification({
        oAuthAccessToken: cryptography.decrypt(existingUserToken.oAuthAccessToken as string),
        oAuthAccessTokenSecret: cryptography.decrypt(existingUserToken.oAuthAccessTokenSecret as string),
      });
      // schedue twitter status update - tweet
      const putScheduledStatusUpdatesResponse = await twitterManager.putScheduledStatusUpdates({
        scheduledStatusUpdates: [{
          twitterScreenName: existingUserToken.twitterScreenName as string,
          status,
          inReplyToStatusId,
          autoPopulateReplyMetadata,
        }],
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#scheduleStatusUpdate::successfully executed');
      // return explicitly
      return putScheduledStatusUpdatesResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterStatusService::#scheduleStatusUpdate::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async updateScheduledStatusUpdate() {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#updateScheduledStatusUpdate::initiating execution');
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#updateScheduledStatusUpdate::successfully executed');
      // return explicitly
      return;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterStatusService::#updateScheduledStatusUpdate::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async deleteScheduledStatusUpdate() {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#deleteScheduledStatusUpdate::initiating execution');
      // log for debugging and run support purposes
      logger.info('{}TwitterStatusService::#deleteScheduledStatusUpdate::successfully executed');
      // return explicitly
      return;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterStatusService::#deleteScheduledStatusUpdate::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
