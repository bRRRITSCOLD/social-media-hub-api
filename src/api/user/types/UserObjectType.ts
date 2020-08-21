// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';

// models
import { UserTokenObjectType } from './UserTokenObjectType';

@ObjectType({ description: 'User Object Type' })
export class UserObjectType {
  @Field((_type: unknown) => String)
  public userId: string;

  @Field((_type: unknown) => String)
  public firstName: string;

  @Field((_type: unknown) => String)
  public lastName: string;

  @Field((_type: unknown) => String)
  public emailAddress: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  public password?: string | null;

  @Field((_type: unknown) => [UserTokenObjectType], { nullable: true })
  public tokens?: UserTokenObjectType[] | null;
}
