// // node modules
// import { Resolver, Query, FieldResolver, Root } from 'type-graphql';
// import * as _ from 'lodash';
// import { default as iterate } from 'itiriri';

// // models
// import { Match, Matches } from '../../models/matches';
// import { Team, Teams } from '../../models/teams';

// // services
// import { MatchService } from './matches.service';
// import { TeamService } from '../teams/teams.service';
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// @Resolver(_of => Match)
// export class MatchResolver {
//   public constructor(private matchService: MatchService, private teamService: TeamService) {}

//   @JWTAuthorization()
//   @Query(_returns => [Match])
//   public async matches(): Promise<Match[]> {
//     try {
//       const matches: Matches = await this.matchService.fetchAll();
//       return iterate(matches.MATCHES)
//         .map((match: Match) => {
//           return { ...match };
//         })
//         .toArray();
//     } catch (error) {
//       throw error;
//     }
//   }

//   @FieldResolver()
//   public async teams(@Root() match: Match) {
//     try {
//       // @ts-ignore
//       const tms: Teams = await this.teamService.fetchSome(_.get(match, 'teams', []).map((team: any) => team.id));
//       return iterate(tms.TEAMS)
//         .filter((team: Team) => team.id !== null && team.id !== undefined)
//         .map((team: Team) => {
//           return { ...team };
//         })
//         .toArray();
//     } catch (error) {
//       throw error;
//     }
//   }
// }
