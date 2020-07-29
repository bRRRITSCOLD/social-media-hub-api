// node_modules
import {
  ArgsType, Field, InputType, ObjectType,
} from 'type-graphql';

@ObjectType({ description: 'User Type' })
export class UserType {
  @Field((_type: unknown) => String)
  public firstName: string;

  @Field((_type: unknown) => String)
  public lastName: string;

  @Field((_type: unknown) => String)
  public emailAddress: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  public password?: string | null;
}

/**
 *
 *
 * @class GetOAuthAccessTokenArgs
 */
@InputType()
export class RegisterUserInputType {
  @Field((_type: unknown) => String)
  firstName: string;

  @Field((_type: unknown) => String)
  lastName: string;

  @Field((_type: unknown) => String)
  emailAddress: string;

  @Field((_type: unknown) => String)
  password: string;
}
