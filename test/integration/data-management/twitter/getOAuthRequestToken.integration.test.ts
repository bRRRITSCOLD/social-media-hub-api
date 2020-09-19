/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import * as _ from 'lodash';

// libraries
import { integrationTwitterTestEnv } from '../../../lib';
import { mongo } from '../../../../src/lib/mongo';
import * as authentication from '../../../../src/lib/authentication';

// models

// testees
import * as twitterManager from '../../../../src/data-management/twitter';

// mock/static/cached data

// file constants/functions
async function customStartUp() {
  try {
    // return explicitly
    return;
  } catch (err) {
    // throw error explicitly
    throw err;
  }
}

// tests
describe('data-management/twitter integration tests', () => {
  before(async () => {
    try {
      // load envs - do this sequentially
      // to get the right values set - since
      // we need a real user to run twitter tests
      // run "real" env last to set "real" env vars
      await integrationTwitterTestEnv.init();
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([
        mongo.init([...require('../../../../src/configs/mongo').default]),
      ]);
      // initialize synchronous libraries, connectiones, etc. here
      [authentication.oAuthConnector.init([...require('../../../../src/configs/oauth').default])];
      // cusom start up functionality
      await customStartUp();
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
