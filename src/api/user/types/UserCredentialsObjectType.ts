// node_modules
import {
  Field, ObjectType,
} from 'type-graphql';

@ObjectType({ description: 'User Credentials Object Type' })
export class UserCredentialsObjectType {
  @Field((_type: unknown) => String)
  jwt: string;

  @Field((_type: unknown) => String)
  jwtRefreshToken: string;
}
