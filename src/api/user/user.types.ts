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

@InputType()
export class LoginUserInputType {
  @Field((_type: unknown) => String)
  emailAddress: string;

  @Field((_type: unknown) => String)
  password: string;

  @Field((_type: unknown) => String, { nullable: true })
  ipAddress?: string;
}

@ObjectType()
export class UserCredentialsType {
  @Field((_type: unknown) => String)
  jwt: string;
}
