// node_modules
import {
  Field, InputType,
} from 'type-graphql';

@InputType()
export class TwitterOAuthAccessTokenInputType {
  @Field((_type: unknown) => String)
  oAuthVerifier: string;
}
