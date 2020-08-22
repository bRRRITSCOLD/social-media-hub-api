// node_modules
import {
  Field, InputType,
} from 'type-graphql';

@InputType()
export class TwitterStatusUpdateInputType {
  @Field((_type: unknown) => String)
  status: string;

  @Field((_type: unknown) => String, { nullable: true })
  inReplyToStatusId?: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  autoPopulateReplyMetadata?: string;
}
