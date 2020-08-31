// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';
import { ScopeAuthorization } from '../../../lib/decorators';

@ObjectType({ description: 'User Token Object Type' })
export class UserTokenObjectType {
  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String)
  public type: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  public oAuthAccessToken?: string;
  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String, { nullable: true })
  public oAuthAccessTokenSecret?: string;
}
