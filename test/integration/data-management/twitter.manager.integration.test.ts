/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import { env } from '../../../src/lib/environment';

// models

// testees
import * as twitterManager from '../../../src/data-management/twitter.manager';
import { oAuthConnector } from '../../../src/lib/authentication';

// mock/static data

// tests
describe('data-management/twitter.manager integration tests', () => {
  before(async () => {
    try {
      // load env
      await env.init({ ...require('../../../src/configs/environment').default });
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([]);
      // initialize synchronous libraries, connectiones, etc. here
      [oAuthConnector.init([...require('../../../src/configs/oauth').default])];
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  describe('#getOAuthRequestToken', () => {
    beforeEach(async () => {
      try {
      // return explicitly
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });

    afterEach(async () => {
      try {
      // return explicitly
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });

    it('- should get an oauth request token, an oauth request token secret, and additional information from twitter', async () => {
      try {
        // run testee
        const getOAuthRequestTokenResponse = await twitterManager.getOAuthRequestToken();
        // validate results
        expect(getOAuthRequestTokenResponse !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthRequestToken !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthRequestTokenSecret !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthCallbackConfirmed !== undefined).to.be.true;
        expect(getOAuthRequestTokenResponse.oAuthCallbackConfirmed).to.be.true;
        // return explicitly
        return;
      } catch (err) {
      // throw explicitly
        throw err;
      }
    });
  });

  after(async () => {
    try {
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
