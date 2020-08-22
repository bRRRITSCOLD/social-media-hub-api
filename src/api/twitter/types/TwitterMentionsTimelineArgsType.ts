// node_modules
import {
  ArgsType,
  Field,
} from 'type-graphql';

@ArgsType()
export class TwitterMentionsTimelineArgsType {
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
