// node_modules
import {
  Field, InputType,
} from 'type-graphql';

@InputType({ description: 'Refresh User JWT Input Type' })
export class RefreshUserJWTInputType {
  @Field((_type: unknown) => String)
  jwtRefreshToken: string;
}
