import { env } from '../lib/environment';
import { mongo } from '../lib/mongo';
import { AnyObject } from '../models/any';

export interface SearchUsersRequestInterface {
  searchCriteria: AnyObject;
  searchOptions: {
    pageNumber?: number;
    pageSize?: string;
    totalCount?: number
  }
}

export async function searchUsers(
  searchUsersRequest: {
    searchCriteria: AnyObject;
    searchOptions: {
      pageNumber?: number;
      pageSize?: string;
      totalCount?: number
    }
  },
) {
  try {
    // deconstruct for east
    const {
      searchCriteria,
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
    let totalUsers: number;
    // get mongo connection
    const socialMediaHubMongoDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // get cursor
    const cursor = await socialMediaHubMongoDb
      .collection(env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME)
      .find({ ...searchCriteria });
    // get count if wanted by user
    if (totalCount) totalUsers = await cursor.count();

    return {
      users: [],
      moreUsers: [],
      totalUsers,
    };
  } catch (err) {
    throw err;
  }
}
