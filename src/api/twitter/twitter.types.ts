// node_modules
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { TwitterTweetInterface, TwitterUserInterface } from '../../models/twitter';

@InputType()
export class TwitterOAuthAccessTokenInputType {
  @Field((_type: unknown) => String)
  oAuthVerifier: string;
}

@ArgsType()
export class TwitterUserTimelineArgsType {
  @Field((_type: unknown) => String, { nullable: true })
  twitterUserId?: string;

  @Field((_type: unknown) => String, { nullable: true })
  twitterScreenName?: string;

  @Field((_type: unknown) => String, { nullable: true })
  sinceId?: string;

  @Field((_type: unknown) => String, { nullable: true })
  maxId?: string;

  @Field((_type: unknown) => Number, { nullable: true })
  count?: number;

  @Field((_type: unknown) => String, { nullable: true })
  trimUser?: string;

  @Field((_type: unknown) => String, { nullable: true })
  excludeReplies?: string;

  @Field((_type: unknown) => String, { nullable: true })
  includeRts?: string;
}

@ObjectType({ description: 'Twitter User Type' })
export class TwitterUserType implements TwitterUserInterface {
  @Field((_type: unknown) => Number, { nullable: true })
  id: number;

  @Field((_type: unknown) => String, { nullable: true })
  idStr: string;

  @Field((_type: unknown) => String, { nullable: true })
  name: string;

  @Field((_type: unknown) => String, { nullable: true })
  screenName: string;

  @Field((_type: unknown) => String, { nullable: true })
  location: string;

  @Field((_type: unknown) => String, { nullable: true })
  description: string;

  @Field((_type: unknown) => String, { nullable: true })
  url: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  protected: boolean;

  @Field((_type: unknown) => Number, { nullable: true })
  followersCount: number;

  @Field((_type: unknown) => Number, { nullable: true })
  friendsCount: number;

  @Field((_type: unknown) => Number, { nullable: true })
  listedCount: number;

  @Field((_type: unknown) => String, { nullable: true })
  createdAt: string;

  @Field((_type: unknown) => Number, { nullable: true })
  favouritesCount: number;

  @Field((_type: unknown) => String, { nullable: true })
  utcOffset?: string | null;

  @Field((_type: unknown) => String, { nullable: true })
  timeZone?: string | null;

  @Field((_type: unknown) => Boolean, { nullable: true })
  geoEnabled: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  verified: boolean;

  @Field((_type: unknown) => Number, { nullable: true })
  statusesCount: number;

  @Field((_type: unknown) => String, { nullable: true })
  lang?: string | null;

  @Field((_type: unknown) => Boolean, { nullable: true })
  contributorsEnabled: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  isTranslator: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  isTranslationEnabled: boolean;

  @Field((_type: unknown) => String, { nullable: true })
  profileBackgroundColor: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileBackgroundImageUrl: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileBackgroundImageUrlHttps: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  profileBackgroundTile: boolean;

  @Field((_type: unknown) => String, { nullable: true })
  profileImageUrl: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileImageUrlHttps: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileBannerUrl: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileLinkColor: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileSidebarBorderColor: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileSidebarFillColor: string;

  @Field((_type: unknown) => String, { nullable: true })
  profileTextColor: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  profileUseBackgroundImage: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  hasExtendedProfile: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  defaultProfile: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  defaultProfileImage: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  following: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  followRequestSent: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  notifications: boolean;

  @Field((_type: unknown) => String, { nullable: true })
  translatorType: string;
}

@ObjectType({ description: 'Twitter Tweet Type' })
export class TwitterTweetType implements TwitterTweetInterface {
  @Field((_type: unknown) => String, { nullable: true })
  createdAt: string;

  @Field((_type: unknown) => Number, { nullable: true })
  id: number;

  @Field((_type: unknown) => String, { nullable: true })
  idStr: string;

  @Field((_type: unknown) => String, { nullable: true })
  text: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  truncated: boolean;

  @Field((_type: unknown) => String, { nullable: true })
  source: string;

  @Field((_type: unknown) => Number, { nullable: true })
  inReplyToStatusId?: number | null;

  @Field((_type: unknown) => String, { nullable: true })
  inReplyToStatusIdStr?: string | null;

  @Field((_type: unknown) => Number, { nullable: true })
  inReplyToUserId?: number | null;

  @Field((_type: unknown) => String, { nullable: true })
  inReplyToUserIdStr?: string | null;

  @Field((_type: unknown) => String, { nullable: true })
  inReplyToScreenName?: string | null;

  @Field((_type: unknown) => TwitterUserType, { nullable: true })
  user: TwitterUserType;

  @Field((_type: unknown) => String, { nullable: true })
  geo?: string | null;

  @Field((_type: unknown) => String, { nullable: true })
  coordinates?: string | null;

  @Field((_type: unknown) => String, { nullable: true })
  place?: string | null;

  @Field((_type: unknown) => String, { nullable: true })
  contributors?: string | null;

  @Field((_type: unknown) => Boolean, { nullable: true })
  isQuoteStatus: boolean;

  @Field((_type: unknown) => Number, { nullable: true })
  retweetCount: number;

  @Field((_type: unknown) => Number, { nullable: true })
  favoriteCount: number;

  @Field((_type: unknown) => Boolean, { nullable: true })
  favorited: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  retweeted: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  possiblySensitive: boolean;

  @Field((_type: unknown) => Boolean, { nullable: true })
  possiblySensitiveAppealable: boolean;

  @Field((_type: unknown) => String, { nullable: true })
  lang: string;
  // @Field((_type: unknown) => String)
  // public userId: string;

  // @Field((_type: unknown) => String)
  // public firstName: string;

  // @Field((_type: unknown) => String)
  // public lastName: string;

  // @Field((_type: unknown) => String)
  // public emailAddress: string;

  // @Field((_type: unknown) => Boolean, { nullable: true })
  // public password?: string | null;

  // @Field((_type: unknown) => [UserTokenType], { nullable: true })
  // public tokens?: UserTokenType[] | null;
}
