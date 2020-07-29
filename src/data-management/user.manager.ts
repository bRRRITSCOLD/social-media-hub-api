import { env } from '../lib/environment';
import { mongo } from '../lib/mongo';
import { AnyObject } from '../models/any';
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
    cursor.skip(pageSize * (pageNumber - 1));
    cursor.limit(pageSize + 1);
    const fountItems: UserInterface[] = await cursor.toArray();
    return {
      users: fountItems.slice(0, pageSize).map((foundItem: UserInterface) => new User(foundItem)),
      moreUsers: fountItems.length > pageSize,
      totalUsers,
    };
  } catch (err) {
    throw err;
  }
}
