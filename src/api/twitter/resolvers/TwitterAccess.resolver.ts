// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver,
  Ctx,
  Mutation,
  Arg,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
import { APIError } from '../../../models/error';
import { AnyObject } from '../../../models/common';
import { TwitterOAuthAccessTokenInputType } from '../types';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import { env } from '../../../lib/environment';
import { JWTAuthorization, ScopeAuthorization } from '../../../lib/decorators';
import * as authentication from '../../../lib/authentication';
import * as cryptography from '../../../lib/cryptography';

// services
import { TwitterAccessService } from '../services';

class TwitterAccess {}

/**
 *
 *
 * @export
 * @class TwitterResolver
 */
@Service()
@Resolver((_of: unknown) => TwitterAccess)
export class TwitterAccessResolver {
  public constructor(private readonly twitterAccessService: TwitterAccessService) {}

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Mutation((_returns: unknown) => String)
  public async twitterOAuthRequestToken(@Ctx() context: any): Promise<string> {
    try {
    // create params here for ease
      const [
        { userId },
      ]: any[] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
      ];
      // call service
      const oAuthRequestTokenResponse = await this.twitterAccessService.oAuthRequestToken({
        userId,
      });
      // oAuthRequestToken cookie
      context.response.clearCookie('oAuthRequestToken');
      context.response.setCookie(
        'oAuthRequestToken',
        cryptography.sign(
          oAuthRequestTokenResponse.oAuthRequestToken as string,
          env.COOKIE_SECRET,
        ),
        { path: '/', httpOnly: true },
      );
      // oAuthRequestTokenSecret cookie
      context.response.clearCookie('oAuthRequestTokenSecret');
      context.response.setCookie(
        'oAuthRequestTokenSecret',
        cryptography.sign(
          oAuthRequestTokenResponse.oAuthRequestTokenSecret as string,
          env.COOKIE_SECRET,
        ),
        { path: '/', httpOnly: true },
      );
      // return the authorization link
      return oAuthRequestTokenResponse.oAuthAccessAuhthorizeUrl as string;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterAccessService::#twitterOAuthRequestToken::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Mutation((_returns: unknown) => Boolean)
  public async twitterOAuthAccessToken(@Ctx() context: any, @Arg('data') twitterOAuthAccessTokenInputType: TwitterOAuthAccessTokenInputType): Promise<boolean> {
    try {
      // create params here for ease
      const [
        { userId },
        { oAuthVerifier },
        oAuthRequestToken,
        oAuthRequestTokenSecret,
      ]: any[] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
        twitterOAuthAccessTokenInputType,
        cryptography.unsign(
          context.request.cookies.oAuthRequestToken,
          env.COOKIE_SECRET,
        ) as string,
        cryptography.unsign(
          context.request.cookies.oAuthRequestTokenSecret,
          env.COOKIE_SECRET,
        ) as string,
      ];
      // call service to get
      // access tokens
      await this.twitterAccessService.oAuthAccessToken({
        userId,
        oAuthVerifier,
        oAuthRequestToken,
        oAuthRequestTokenSecret,
      });
      // clear oAuthRequestToken cookie if we
      // have gotten this far - if we have we have been successful
      context.response.clearCookie('oAuthRequestToken');
      // clear oAuthRequestTokenSecret cookie if we
      // have gotten this far - if we have we have been successful
      context.response.clearCookie('oAuthRequestTokenSecret');
      // return true indicating
      // we have authed with twitter
      return true;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterAccessService::#twitterOAuthAccessToken::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }
}
