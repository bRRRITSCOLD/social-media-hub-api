// import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectType, Field } from 'type-graphql';

// models
// import { ScopeAuthorization } from '../decorators/security';

// @ObjectType({ description: 'Twitter model' })
// export class Twitter {
//   // @ScopeAuthorization(['*'])
//   // @Field(_type => ID, { nullable: true })
//   // public id?: number;

//   // @ScopeAuthorization(['*'])
//   // @Field(_type => [Team], { nullable: true })
//   // public teams?: Team[];

//   // @ScopeAuthorization(['*'])
//   // @Field({ nullable: true })
//   // public format?: string;

//   // @ScopeAuthorization(['*'])
//   // @Field({ nullable: true })
//   // public event?: string;

//   // // @Field(_type => [string])
//   // // public maps: string[];

//   // @ScopeAuthorization(['*'])
//   @Field({ nullable: true })
//   public loggedIn?: boolean;

//   // @ScopeAuthorization(['*'])
//   // @Field({ nullable: true })
//   // public stars?: number;
// }

@ObjectType({ description: 'Twitter model' })
export class Twitter {
  @Field(_type => Boolean, { nullable: true })
  public loggedIn?: boolean;
}