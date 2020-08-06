// node_modules
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import { oAuthConnector, OAuth, jwt } from '../../lib/authentication';
import { env } from '../../lib/environment';
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';
import * as cryptography from '../../lib/cryptography';

// models
import { APIError } from '../../models/error';
import { UserToken, UserTokenTypeEnum } from '../../models/user-token';
import { User } from '../../models/user';

// models
import * as userManager from '../../data-management/user.manager';
import * as userTokenManager from '../../data-management/user-token.manager';

@Service()
export class TwitterService {
  public async getOAuthRequestToken(data: {jwt: string; }): Promise<UserToken> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthRequestToken::initiating execution');
      // get and possibly existing twitter o auth token
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { emailAddress: _.get(jwt.decode(data.jwt), 'emailAddress', '') },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: { emailAddress: _.get(jwt.decode(data.jwt), 'emailAddress', '') },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
      ]);
      // get twitter oauth client
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      // wrap call in promise for use in async/await
      const getOAuthRequestToken = (): Promise<any> => new Promise((res: any, rej: any) => {
        twitterOAuthClient.getOAuthRequestToken((err: any, oAuthRequestToken: string, oAuthRequestTokenSecret: string, results: any) => {
          if (err) return rej(err);
          return res({
            oAuthRequestToken,
            oAuthRequestTokenSecret,
            ...results,
          });
        });
      });
      // call new wrapped function
      const getOAuthRequestTokenResponse = await getOAuthRequestToken();
      // store the encrypted and signed values in mongo
      const newUserTwitterToken = new UserToken(
        _.assign(
          {},
          existingUserToken || {},
          {
            oAuthRequestToken: getOAuthRequestTokenResponse.oAuthRequestToken,
            oAuthRequestTokenSecret: getOAuthRequestTokenResponse.oAuthRequestTokenSecret,
            oAuthAccessAuhthorizeUrl: `https://twitter.com/oauth/authorize?oauth_token=${getOAuthRequestTokenResponse.oAuthRequestToken}`,
          },
        ),
      );
      // get sal rounds for encrypting password
      const saltRounds = await cryptography.password.genSalt();
      // encrpyt a user's password
      existingUserToken.oAuthRequestToken = await cryptography.password.hash(newUserTwitterToken.oAuthRequestToken, saltRounds);
      existingUserToken.oAuthRequestTokenSecret = await cryptography.password.hash(newUserTwitterToken.oAuthRequestTokenSecret, saltRounds);
      // store tokens
      await userTokenManager.putUserToken({
        userToken: _.assign(),
        putCriteria: { userId: '', userTokenId: '' },
      });
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthRequestToken::successfully executed');
      // return resulst explicitly
      return userTwitterToken;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}TwitterService::#getOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async getOAuthAccessToken(
    data: {
      jwt: string;
      oAuthRequestToken: string;
      oAuthRequestTokenSecret: string;
      oAuthVerifier: string;
    },
  ): Promise<boolean> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthAccessToken::initiating execution');
      // deconstruct for ease
      const { oAuthRequestToken, oAuthRequestTokenSecret, oAuthVerifier } = getOAuthAccessTokenRequest;
      // get and possibly existing twitter o auth token
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { emailAddress: _.get(jwt.decode(data.jwt), 'emailAddress', '') },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: { emailAddress: _.get(jwt.decode(data.jwt), 'emailAddress', '') },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
      ]);
      // check that the tokens
      // get twitter oauth client
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      // wrap call in promise for use in async/await
      const getOAuthAccessToken = () => new Promise((res: any, rej: any) => {
        twitterOAuthClient.getOAuthAccessToken(oAuthRequestToken, oAuthRequestTokenSecret, oAuthVerifier, (err, oAuthAccessToken, oAuthAccessTokenSecret, results) => {
          if (err) return rej(err);
          return res({
            oAuthAccessToken,
            oAuthAccessTokenSecret,
            ...results,
          });
        });
      });
      // call new wrapped function
      const getOAuthAccessTokenResponse = await getOAuthAccessToken();
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthAccessToken::successfully executed');
      // return resulst explicitly
      return getOAuthAccessTokenResponse as {
        [key: string]: any;
        [key: number]: any;
        oAuthAccessToken: string;
        oAuthAccessTokenSecret: string;
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}TwitterService::#getOAuthAccessToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}

// const consumer = new oauth.OAuth("https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",_twitterConsumerKey, _twitterConsumerSecret, "1.0A", twitterCallbackUrl, "HMAC-SHA1");
// const express = require('express');
// const router = express.Router();
// const CryptoJS = require("crypto-js");
// const oauth = require('oauth');
// const _twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
// const _twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
// const twitterCallbackUrl = process.env.TWITTER_CALLBACK_URL;
// const consumer = new oauth.OAuth("https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",_twitterConsumerKey, _twitterConsumerSecret, "1.0A", twitterCallbackUrl, "HMAC-SHA1");
// router.get('/connect', (req, res) => {
//   consumer.getOAuthRequestToken(function (error, oauthToken,   oauthTokenSecret, results) {
//     if (error) {
//       res.send(error, 500);
//     } else {
//       req.session.oauthRequestToken = oauthToken;
//       req.session.oauthRequestTokenSecret = oauthTokenSecret;
//       const redirect = {
// redirectUrl: `https://twitter.com/oauth/authorize?  oauth_token=${req.session.oauthRequestToken}`
//     }
//       res.send(redirect);
//     }
//   });
// });
// router.get('/saveAccessTokens', authCheck, (req, res) => {
//   consumer.getOAuthAccessToken(
//   req.query.oauth_token,
//   req.session.oauthRequestTokenSecret,
//   req.query.oauth_verifier,
//   (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
//     if (error) {
//       logger.error(error);
//       res.send(error, 500);
//     }
//     else {
//       req.session.oauthAccessToken = oauthAccessToken;
//       req.session.oauthAccessTokenSecret = oauthAccessTokenSecret
//       return res.send({ message: 'token saved' });
//     }
//   });
// });
// module.exports = router;
