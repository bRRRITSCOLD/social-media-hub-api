// node_modules
import { Service } from 'typedi';
import * as oauth from 'oauth';
import { promisify } from 'util';

//models
import { env } from '../../lib/environment';

@Service()
export class TwitterService {
  public constructor() {}

  public async login(): Promise<any> {
    try {
      const consumer = new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        env.TIWTTER_CONSUMER_KEY,
        env.TIWTTER_CONSUMER_SECRET,
        "1.0A",
        'http://127.0.0.1:8000',
        "HMAC-SHA1"
      );
      const lol = () => new Promise((res: any, rej: any) => {
        consumer.getOAuthRequestToken((err, oAuthToken, oAuthTokenSecret, results) => {
          if (err) return rej(err);
          return res({
            oAuthToken,
            oAuthTokenSecret,
            ...results
          });
        })
      })
      const getOAuthRequestTokenResponse = await lol();
      return getOAuthRequestTokenResponse;
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