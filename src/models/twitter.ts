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

@ObjectType({ description: 'Twitter model' })
export class Twitter {
  @Field((_type: unknown) => Boolean, { nullable: true })
  public loggedIn?: boolean;
}

export interface Tweet {
  createdAt: string;
  id: number;
  idStr: string;
  text: string;
  truncated: boolean;
  entities: TweetEntities;
  extendedEntities: TweetExtendedEntities;
  source: string;
  inReplyToStatusId?: null;
  inReplyToStatusIdStr?: null;
  inReplyToUserId?: null;
  inReplyToUserIdStr?: null;
  inReplyToScreenName?: null;
  user: User;
  geo?: null;
  coordinates?: null;
  place?: null;
  contributors?: null;
  isQuoteStatus: boolean;
  retweetCount: number;
  favoriteCount: number;
  favorited: boolean;
  retweeted: boolean;
  possiblySensitive: boolean;
  possiblySensitiveAppealable: boolean;
  lang: string;
}

export interface TweetEntities {
  hashtags?: (null)[] | null;
  symbols?: (null)[] | null;
  userMentions?: (null)[] | null;
  urls?: (null)[] | null;
  media?: (TweetMediaEntity)[] | null;
}

export interface TweetMediaEntity {
  id: number;
  idStr: string;
  indices?: (number)[] | null;
  mediaUrl: string;
  mediaUrlHttps: string;
  url: string;
  displayUrl: string;
  expandedUrl: string;
  type: string;
  sizes: TweetMediaEntitySizes;
}

export interface TweetMediaEntitySizes {
  thumb: ThumbOrSmallOrMediumOrLarge;
  small: ThumbOrSmallOrMediumOrLarge;
  medium: ThumbOrSmallOrMediumOrLarge;
  large: ThumbOrSmallOrMediumOrLarge;
}

export interface ThumbOrSmallOrMediumOrLarge {
  w: number;
  h: number;
  resize: string;
}

export interface TweetExtendedEntities {
  media?: (TweetMediaEntity)[] | null;
}

export interface VideoInfo {
  aspectRatio?: (number)[] | null;
  durationMillis: number;
  variants?: (VariantsEntity)[] | null;
}

export interface VariantsEntity {
  bitrate?: number | null;
  contentType: string;
  url: string;
}

export interface AdditionalMediaInfo {
  title: string;
  description: string;
  callToActions: CallToActions;
  monetizable: boolean;
}

export interface CallToActions {
  visitSite: VisitSite;
}

export interface VisitSite {
  url: string;
}

export interface User {
  id: number;
  idStr: string;
  name: string;
  screenName: string;
  location: string;
  description: string;
  url: string;
  entities: Entities1;
  protected: boolean;
  followersCount: number;
  friendsCount: number;
  listedCount: number;
  createdAt: string;
  favouritesCount: number;
  utcOffset?: null;
  timeZone?: null;
  geoEnabled: boolean;
  verified: boolean;
  statusesCount: number;
  lang?: null;
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

export interface Entities1 {
  url: Url;
  description: Description;
}

export interface Url {
  urls?: (UrlsEntity)[] | null;
}

export interface UrlsEntity {
  url: string;
  expandedUrl: string;
  displayUrl: string;
  indices?: (number)[] | null;
}

export interface Description {
  urls?: (null)[] | null;
}
