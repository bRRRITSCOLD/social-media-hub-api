// node_modules
import {
  Field, InputType,
} from 'type-graphql';

@InputType({ description: 'Register User Input Type' })
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
