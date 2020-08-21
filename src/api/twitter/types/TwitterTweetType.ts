// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';

// models
import { TwitterTweetInterface } from '../../../models/twitter';
import { TwitterUserType } from './TwitterUserType';

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
