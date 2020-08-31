// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';

// models
import { TwitterTweetInterface } from '../../../models/twitter';
import { TwitterUserObjectType } from './TwitterUserObjectType';
import { ScopeAuthorization } from '../../../lib/decorators';

@ObjectType({ description: 'Twitter Tweet Object Type' })
export class TwitterTweetObjectType implements TwitterTweetInterface {
  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  createdAt: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  id: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  idStr: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  text: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  truncated: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  source: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  inReplyToStatusId?: number | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  inReplyToStatusIdStr?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  inReplyToUserId?: number | null;

  @Field((_type: unknown) => String, { nullable: true })
  inReplyToUserIdStr?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  inReplyToScreenName?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => TwitterUserObjectType, { nullable: true })
  user: TwitterUserObjectType;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  geo?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  coordinates?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  place?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  contributors?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  isQuoteStatus: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  retweetCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  favoriteCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  favorited: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  retweeted: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  possiblySensitive: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  possiblySensitiveAppealable: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  lang: string;
}
