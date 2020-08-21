// node_modules
import * as _ from 'lodash';

// libraries
import { env } from '../../lib/environment';
import { mongo } from '../../lib/mongo';

// models
import { UserInterface } from '../../models/user';
import { UserToken } from '../../models/user-token';
import { AnyObject } from '../../models/common';

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
