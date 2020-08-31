// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';
import { TwitterUserInterface } from '../../../models/twitter';
import { ScopeAuthorization } from '../../../lib/decorators';

@ObjectType({ description: 'Twitter User Object Type' })
export class TwitterUserObjectType implements TwitterUserInterface {
  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  id: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  idStr: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  name: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  screenName: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  location: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  description: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  url: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  protected: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  followersCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  friendsCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  listedCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  createdAt: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  favouritesCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  utcOffset?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  timeZone?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  geoEnabled: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  verified: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Number, { nullable: true })
  statusesCount: number;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  lang?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  contributorsEnabled: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  isTranslator: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  isTranslationEnabled: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileBackgroundColor: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileBackgroundImageUrl: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileBackgroundImageUrlHttps: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  profileBackgroundTile: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileImageUrl: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileImageUrlHttps: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileBannerUrl: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileLinkColor: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileSidebarBorderColor: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileSidebarFillColor: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  profileTextColor: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  profileUseBackgroundImage: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  hasExtendedProfile: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  defaultProfile: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  defaultProfileImage: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  following: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  followRequestSent: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  notifications: boolean;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  translatorType: string;
}
