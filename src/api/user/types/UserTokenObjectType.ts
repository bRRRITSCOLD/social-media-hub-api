// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';

@ObjectType({ description: 'User Token Object Type' })
export class UserTokenObjectType {
  @Field((_type: unknown) => String)
  public type: string;

  @Field((_type: unknown) => String, { nullable: true })
  public oAuthAccessToken?: string;

  @Field((_type: unknown) => String, { nullable: true })
  public oAuthAccessTokenSecret?: string;
}
