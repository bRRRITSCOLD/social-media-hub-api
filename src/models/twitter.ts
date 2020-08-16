// import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectType, Field } from 'type-graphql';

// models
// import { ScopeAuthorization } from '../decorators/security';

// @ObjectType({ description: 'Twitter model' })
// export class Twitter {
//   // @ScopeAuthorization(['*'])
//   // @Field(_type => ID, { nullable: true })
//   // public id?: number;

//   // @ScopeAuthorization(['*'])
//   // @Field(_type => [Team], { nullable: true })
//   // public teams?: Team[];

//   // @ScopeAuthorization(['*'])
//   // @Field({ nullable: true })
//   // public format?: string;

//   // @ScopeAuthorization(['*'])
//   // @Field({ nullable: true })
//   // public event?: string;

//   // // @Field(_type => [string])
//   // // public maps: string[];

//   // @ScopeAuthorization(['*'])
//   @Field({ nullable: true })
//   public loggedIn?: boolean;

//   // @ScopeAuthorization(['*'])
//   // @Field({ nullable: true })
//   // public stars?: number;
// }

export interface TwitterUserInterface {
  id: number;
  idStr: string;
  name: string;
  screenName: string;
  location: string;
  description: string;
  url: string;
  protected: boolean;
  followersCount: number;
  friendsCount: number;
  listedCount: number;
  createdAt: string;
  favouritesCount: number;
  utcOffset?: string | null;
  timeZone?: string | null;
  geoEnabled: boolean;
  verified: boolean;
  statusesCount: number;
  lang?: string | null;
  contributorsEnabled: boolean;
  isTranslator: boolean;
  isTranslationEnabled: boolean;
  profileBackgroundColor: string;
  profileBackgroundImageUrl: string;
  profileBackgroundImageUrlHttps: string;
  profileBackgroundTile: boolean;
  profileImageUrl: string;
  profileImageUrlHttps: string;
  profileBannerUrl: string;
  profileLinkColor: string;
  profileSidebarBorderColor: string;
  profileSidebarFillColor: string;
  profileTextColor: string;
  profileUseBackgroundImage: boolean;
  hasExtendedProfile: boolean;
  defaultProfile: boolean;
  defaultProfileImage: boolean;
  following: boolean;
  followRequestSent: boolean;
  notifications: boolean;
  translatorType: string;
}

export interface TwitterTweetInterface {
  createdAt: string;
  id: number;
  idStr: string;
  text: string;
  truncated: boolean;
  source: string;
  inReplyToStatusId?: number | null;
  inReplyToStatusIdStr?: string | null;
  inReplyToUserId?: number | null;
  inReplyToUserIdStr?: string | null;
  inReplyToScreenName?: string | null;
  user: TwitterUserInterface;
  geo?: string | null;
  coordinates?: string | null;
  place?: string | null;
  contributors?: string | null;
  isQuoteStatus: boolean;
  retweetCount: number;
  favoriteCount: number;
  favorited: boolean;
  retweeted: boolean;
  possiblySensitive: boolean;
  possiblySensitiveAppealable: boolean;
  lang: string;
}
