// TODO: add test for tokens property of User class instance in each applicable test

/* eslint-disable @typescript-eslint/no-unused-expressions */
// node_modules
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import { integrationTestEnv, testUtils } from '../../../lib';
import { mongo } from '../../../../src/lib/mongo';
import { cloudWatchEvents } from '../../../../src/lib/aws';

// models
import { User } from '../../../../src/models/user';

// testees
import { cloudWatchEventManager } from '../../../../src/data-management';

// mock/static data
import { MockUser } from '../../../data/mock/user';
import { CloudWatchEventRule } from '../../../../src/models';

// let mockUsers: Partial<User>[] | Partial<MockUser>[];
let staticCloudWatchEventRules: Partial<CloudWatchEventRule>[] | Partial<CloudWatchEventRule>[];

let testCloudWatchEventRules: Partial<CloudWatchEventRule>[] | Partial<CloudWatchEventRule>[];

// file constants/functions
async function customStartUp() {
  try {
    // load data for tests
    staticCloudWatchEventRules = JSON.parse(await testUtils.files.readFile(`${process.cwd()}/test/data/static/cloud-watch-event-rules.json`, { encoding: 'utf-8' }));
    // return explicitly
    return;
  } catch (err) {
    throw err;
  }
}

// tests
describe('data-management/cloud-watch-events/putRule integration tests', () => {
  before(async () => {
    try {
      // load env
      await integrationTestEnv.init();
      // initialize asynchronous libraries, connectiones, etc. here
      await Promise.all([]);
      // initialize synchronous libraries, connectiones, etc. here
      [
        cloudWatchEvents.init({ region: 'us-east-1', endpoint: integrationTestEnv.AWS_LOCALSTACK_ENDPOINT }),
      ];
      // cusom start up tasks
      await customStartUp();
      // return explicitly
      return;
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });

  context('static data', () => {
    beforeEach(async () => {
      try {
        // create test data
        testCloudWatchEventRules = staticCloudWatchEventRules.slice(0, staticCloudWatchEventRules.length);
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    afterEach(async () => {
      try {
        // reset test data
        staticCloudWatchEventRules = [];
        // return explicitly
      } catch (err) {
        // throw explicitly
        throw err;
      }
    });

    it('- should create and return a correctly mapped User class instance', async () => {
      try {
        // set test data
        const testCloudWatchEventRule = _.assign({}, testCloudWatchEventRules.slice(0, 1)[0]);
        // set expectations
        const EXPECTED_STRING_TYPE: any = 'string';
        // run testee
        const putRuleResponse = await cloudWatchEventManager.putRule(testCloudWatchEventRule as any);
        // validate results
        expect(putRuleResponse !== undefined).to.be.true;
        expect(putRuleResponse.ruleArn !== undefined).to.be.true;
        expect(typeof putRuleResponse.ruleArn === EXPECTED_STRING_TYPE).to.be.true;
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
    } catch (err) {
      // throw explicitly
      throw err;
    }
  });
});
