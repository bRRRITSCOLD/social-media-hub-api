// node_modules
import { Service } from 'typedi';

// libraries
import { oAuthConnector, OAuth } from '../../lib/authentication';
import { env } from '../../lib/environment';
import { logger } from '../../lib/logger';
import { mongo } from '../../lib/mongo';
import { anyy } from '../../lib/utils';

// models
import { APIError } from '../../models/error';
import { User, UserInterface } from '../../models/user';

// data-management
import * as userManager from '../../data-management/user.manager';

@Service()
export class UserService {
  public async registerUser(user: UserInterface): Promise<User> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}UserService::#registerUser::initiating execution');
      // first create a new user instace
      const newUser = new User(user);
      // validate that the data passed
      // in adheres to the user schema
      const schemaValidation = await newUser.validateAsync();
      // if there is an error throw said error
      if (schemaValidation.error) throw new APIError(
        new Error(schemaValidation.error),
      );
      // seach for a user with the current email address passed in
      const { users: [existingUser] } = await userManager.searchUsers({
        searchCriteria: { emailAddress: newUser.emailAddress },
        searchOptions: { pageNumber: 1, pageSize: 1 },
      });
      // if there is an existing user throw an error -
      // only one user allowed per email address
      if (existingUser) throw new APIError(
        `A user already exists with the email address ${existingUser.emailAddress}`,
      );
      // log for debugging and run support purposes
      logger.debug('{}UserService::#registerUser::successfully executed');
      // return resulst explicitly
      return newUser;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}UserService::#registerUser::error executing::error=${anyy.stringify(error)}`);
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
