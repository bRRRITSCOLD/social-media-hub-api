// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
import { APIError, AnyObject } from '../../../models';
import {
  TwitterStatusUpdateInputType, TwitterTweetObjectType,
} from '../types';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import { JWTAuthorization, ScopeAuthorization } from '../../../lib/decorators';
import { authentication } from '../../../lib';

// services
import { TwitterStatusService } from '../services';

class TwitterTimeline {}

@Service()
@Resolver((_of: unknown) => TwitterTimeline)
export class TwitterStatusResolver {
  public constructor(private readonly twitterStatusService: TwitterStatusService) {}

  @JWTAuthorization()
  @ScopeAuthorization(['Twitter User'])
  @Mutation((_returns: unknown) => [TwitterTweetObjectType])
  public async twitterStatusUpdate(@Ctx() context: any, @Arg('data') twitterStatusUpdateInputType: TwitterStatusUpdateInputType): Promise<TwitterTweetObjectType[]> {
    try {
      // create params here for ease
      const [
        { userId },
        {
          status,
          inReplyToStatusId,
          autoPopulateReplyMetadata,
        },
      ]: any[] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
        twitterStatusUpdateInputType,
      ];
      // call service to get
      // a user timeline that
      // matches the given
      // criteria
      const statusUpdateResponse = await this.twitterStatusService.statusUpdate({
        userId,
        status,
        inReplyToStatusId,
        autoPopulateReplyMetadata,
      });
      // return explicitly
      return [statusUpdateResponse];
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterStatusResolver::#twitterStatusUpdate::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }
}
