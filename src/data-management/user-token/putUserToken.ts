// node_modules
import * as _ from 'lodash';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

// libraries
import { env } from '../../lib/environment';
import { mongo } from '../../lib/mongo';

// models
import { APIError } from '../../models/error';
import { UserToken, UserTokenInterface } from '../../models/user-token';
import { AnyObject } from '../../models/common';

export interface PutUserTokenRequestInterface {
  userToken: UserTokenInterface;
  putCriteria: AnyObject;
  putOptions: Record<string, unknown>;
}

export async function putUserToken(
  putUserTokenRequest: PutUserTokenRequestInterface,
): Promise<UserToken> {
  try {
    // deconstruct for ease
    const {
      userToken, putCriteria,
    } = putUserTokenRequest;
    // first create a new user instace
    const newUserToken = new UserToken(userToken);
    // validate that the data passed
    // in adheres to the user schema
    const schemaValidation = await newUserToken.validateAsync();
    // if there is an error throw said error
    if (schemaValidation.error) throw new APIError(
      schemaValidation.error,
      { statusCode: 400 },
    );
    // get mongo connection
    const socialMediaHubMongoDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get cursor
    const findOneAndUpdateResponse: FindAndModifyWriteOpResultObject<any> = await socialMediaHubMongoDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
      .findOneAndUpdate(
        _.assign({}, putCriteria),
        { $set: _.assign({}, newUserToken) },
        { upsert: true, returnOriginal: false },
      );
    // if mongo query is not ok throw error
    if (findOneAndUpdateResponse.ok !== 1) throw new APIError(
      new Error('Error putting user in mongo'),
      { ...findOneAndUpdateResponse.lastErrorObject },
    );
    // return new user
    return new UserToken(findOneAndUpdateResponse.value as UserTokenInterface);
  } catch (err) {
    throw err;
  }
}
