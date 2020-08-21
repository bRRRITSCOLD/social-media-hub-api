// node_modules
import {
  Field, InputType,
} from 'type-graphql';

@InputType({ description: 'Login User Input Type' })
export class LoginUserInputType {
  @Field((_type: unknown) => String)
  emailAddress: string;

  @Field((_type: unknown) => String)
  password: string;

  @Field((_type: unknown) => String, { nullable: true })
  ipAddress?: string;
}
