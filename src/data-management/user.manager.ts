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

export interface SearchUsersRequestInterface {
  searchCriteria: AnyObject;
  searchOptions: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: boolean;
  }
}

export interface SearchUsersResponseInterface {
  users: User[];
  moreUsers: boolean;
  totalUsers: number | undefined;
}

export async function searchUsers(
  searchUsersRequest: SearchUsersRequestInterface,
): Promise<SearchUsersResponseInterface> {
  try {
    // deconstruct for ease
    const {
      searchCriteria, searchOptions,
    } = searchUsersRequest;
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
    let totalUsers: number | undefined;
    // get mongo connection
    const socialMediaHubMongoDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get cursor
    const cursor = await socialMediaHubMongoDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .find({ ...searchCriteria });
    // get count if wanted by user
    if (totalCount) totalUsers = await cursor.count();
    // skip the number of pages times the page size
    cursor.skip(pageSize * (pageNumber - 1));
    // limit to only the page size
    cursor.limit(pageSize + 1);
    // turn cursor into array of data/objects
    const fountItems: UserInterface[] = await cursor.toArray();
    // return explicitly
    return {
      users: fountItems.slice(0, pageSize).map((foundItem: UserInterface) => new User(foundItem)),
      moreUsers: fountItems.length > pageSize,
      totalUsers,
    };
  } catch (err) {
    throw err;
  }
}

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
      new Error(schemaValidation.error),
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
    throw err;
  }
}
