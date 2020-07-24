import { ObjectType, Field, ID } from 'type-graphql';

import { ScopeAuthorization } from '../decorators/security';

@ObjectType({ description: 'Player model' })
export class Player {
  @ScopeAuthorization(['*'])
  @Field((_type: unknown) => ID, { nullable: true })
  public id?: number;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public name?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public ign?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public image?: string;

  @ScopeAuthorization(['*'])
  @Field({ nullable: true })
  public age?: number;
}
