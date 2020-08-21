// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';
import { TwitterUserInterface } from '../../../models/twitter';

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
