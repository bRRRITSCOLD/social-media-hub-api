// node_modules
import * as _ from 'lodash';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

// libraries
import { env } from '../../lib/environment';
import { mongo } from '../../lib/mongo';

// models
import { APIError } from '../../models/error';
import { User, UserInterface } from '../../models/user';
import { AnyObject } from '../../models/common';

export interface PutUserRequestInterface {
  user: UserInterface;
  putCriteria: AnyObject;
  putOptions: Record<string, unknown>;
}

export async function putUser(
  putUserRequest: PutUserRequestInterface,
): Promise<User> {
  try {
    // deconstruct for ease
    const {
      user, putCriteria,
    } = putUserRequest;
    // first create a new user instace
    const newUser = new User(user);
    // validate that the data passed
    // in adheres to the user schema
    const schemaValidation = await newUser.validateAsync();
    // if there is an error throw said error
    if (schemaValidation.error) throw new APIError(
      schemaValidation.error,
      { statusCode: 400 },
    );
    // get mongo connection
    const socialMediaHubMongoDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get cursor
    const findOneAndUpdateResponse: FindAndModifyWriteOpResultObject<any> = await socialMediaHubMongoDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .findOneAndUpdate(
        _.assign({}, putCriteria),
        { $set: _.assign({}, newUser) },
        { upsert: true, returnOriginal: false },
      );
    // if mongo query is not ok throw error
    if (findOneAndUpdateResponse.ok !== 1) throw new APIError(
      new Error('Error putting user in mongo'),
      { ...findOneAndUpdateResponse.lastErrorObject },
    );
    // return new user
    return new User(findOneAndUpdateResponse.value as UserInterface);
  } catch (err) {
    // build error
    const error = new APIError(err);
    // throw error explicitly
    throw error;
  }
}
