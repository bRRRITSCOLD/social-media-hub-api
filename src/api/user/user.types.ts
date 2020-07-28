// node_modules
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'User Type' })
export class UserType {
  @Field((_type: unknown) => String, { nullable: true })
  public firstName: string;

  @Field((_type: unknown) => String, { nullable: true })
  public lastName: string;

  @Field((_type: unknown) => String, { nullable: true })
  public emailAddress: string;

  @Field((_type: unknown) => Boolean, { nullable: true })
  public password?: boolean;
}

/**
 *
 *
 * @class GetOAuthAccessTokenArgs
 */
@ArgsType()
export class RegisterUserArgs {
  @Field((_type: unknown) => String)
  firstName: string;

  @Field((_type: unknown) => String)
  lastName: string;

  @Field((_type: unknown) => String)
  emailAddress: string;

  @Field((_type: unknown) => String)
  password: string;
}
