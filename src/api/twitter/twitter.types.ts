// node_modules
import {
  Field, InputType, ObjectType,
} from 'type-graphql';

@InputType()
export class GetOAuthAccessTokenInputType {
  @Field((_type: unknown) => String)
  oAuthVerifier: string;
}
