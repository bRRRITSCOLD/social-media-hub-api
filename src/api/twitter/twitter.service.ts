// node_modules
import { Service } from 'typedi';

// libraries
import { oAuthConnector, OAuth } from '../../lib/authentication';

// models
import { env } from '../../lib/environment';

@Service()
export class TwitterService {
  public async getOAuthRequestToken(): Promise<{
    [key: string]: any;
    [key: number]: any;
    oAuthRequestToken: string;
    oAuthRequestTokenSecret: string;
  }> {
    try {
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      const getOAuthRequestToken = () => new Promise((res: any, rej: any) => {
        twitterOAuthClient.getOAuthRequestToken((err: any, oAuthRequestToken: string, oAuthRequestTokenSecret: string, results: any) => {
          if (err) return rej(err);
          return res({
            oAuthRequestToken,
            oAuthRequestTokenSecret,
            ...results,
          });
        });
      });
      const getOAuthRequestTokenResponse = await getOAuthRequestToken();
      return getOAuthRequestTokenResponse as {
        [key: string]: any;
        [key: number]: any;
        oAuthRequestToken: string;
        oAuthRequestTokenSecret: string;
      };
    } catch (error) {
      throw error;
    }
  }

  public async getOAuthAccessToken(
    getOAuthAccessTokenRequest: {
      oAuthRequestToken: string;
      oAuthRequestTokenSecret: string;
      oAuthVerifier: string;
    },
  ): Promise<any> {
    try {
      // deconstruct for ease
      const { oAuthRequestToken, oAuthRequestTokenSecret, oAuthVerifier } = getOAuthAccessTokenRequest;
      // get our twitter oauth client
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      // convert/wrap our oauth client
      // call from a callback to a promise
      const getOAuthAccessToken = () => new Promise((res: any, rej: any) => {
        twitterOAuthClient.getOAuthAccessToken(oAuthRequestToken, oAuthRequestTokenSecret, oAuthVerifier, (err, oauthAccessToken, oauthAccessTokenSecret, results) => {
          if (err) return rej(err);
          return res({
            oauthAccessToken,
            oauthAccessTokenSecret,
            ...results,
          });
        });
      });
      const getOAuthAccessTokenResponse = await getOAuthAccessToken();
      return getOAuthAccessTokenResponse;
    } catch (error) {
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
