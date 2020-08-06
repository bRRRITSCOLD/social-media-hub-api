// node_modules
import * as _ from 'lodash';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

// libraries
import { env } from '../lib/environment';
import { mongo } from '../lib/mongo';

// models
import { AnyObject } from '../models/any';
import { APIError } from '../models/error';
import { User, UserInterface } from '../models/user';
import { UserToken, UserTokenInterface } from '../models/user-token';

export interface SearchUserTokensRequestInterface {
  searchCriteria: AnyObject;
  searchOptions: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: boolean;
  }
}

export interface SearchUserTokensResponseInterface {
  userTokens: UserToken[];
  moreUserTokens: boolean;
  totalUserTokens: number | undefined;
}

export async function searchUserTokens(
  searchUserTokensRequest: SearchUserTokensRequestInterface,
): Promise<SearchUserTokensResponseInterface> {
  try {
    // deconstruct for ease
    const {
      searchCriteria, searchOptions,
    } = searchUserTokensRequest;
    let {
      pageNumber,
      pageSize,
      totalCount,
    } = searchOptions;
    // default options if not passed in
    if (!pageNumber) pageNumber = 1;
    if (!pageSize) pageSize = 500;
    if (!totalCount) totalCount = false;
    // create holder for data computations
    let totalUserTokens: number | undefined;
    // get mongo connection
    const socialMediaHubMongoDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get cursor
    const cursor = await socialMediaHubMongoDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME)
      .find({ ...searchCriteria });
    // get count if wanted by user
    if (totalCount) totalUserTokens = await cursor.count();
    // skip the number of pages times the page size
    cursor.skip(pageSize * (pageNumber - 1));
    // limit to only the page size
    cursor.limit(pageSize + 1);
    // turn cursor into array of data/objects
    const fountItems: UserInterface[] = await cursor.toArray();
    // return explicitly
    return {
      userTokens: fountItems.slice(0, pageSize).map((foundItem: UserInterface) => new UserToken(foundItem)),
      moreUserTokens: fountItems.length > pageSize,
      totalUserTokens,
    };
  } catch (err) {
    throw err;
  }
}

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
