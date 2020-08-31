// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';

// models
import { UserTokenObjectType } from './UserTokenObjectType';
import { ScopeAuthorization } from '../../../lib/decorators';

@ObjectType({ description: 'User Object Type' })
export class UserObjectType {
  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String)
  public userId: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String)
  public firstName: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String)
  public lastName: string;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => String)
  public emailAddress: string;

  @ScopeAuthorization(['NEVER RETURN'])
  @Field((_type: unknown) => Boolean, { nullable: true })
  public password?: string | null;

  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => [UserTokenObjectType], { nullable: true })
  public tokens?: UserTokenObjectType[] | null;
}
