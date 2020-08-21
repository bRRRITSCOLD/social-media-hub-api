// models
import { TwitterUserInterface } from './TwitterUser';

export interface TwitterTweetInterface {
  createdAt: string;
  id: number;
  idStr: string;
  text: string;
  truncated: boolean;
  source: string;
  inReplyToStatusId?: number | null;
  inReplyToStatusIdStr?: string | null;
  inReplyToUserId?: number | null;
  inReplyToUserIdStr?: string | null;
  inReplyToScreenName?: string | null;
  user: TwitterUserInterface;
  geo?: string | null;
  coordinates?: string | null;
  place?: string | null;
  contributors?: string | null;
  isQuoteStatus: boolean;
  retweetCount: number;
  favoriteCount: number;
  favorited: boolean;
  retweeted: boolean;
  possiblySensitive: boolean;
  possiblySensitiveAppealable: boolean;
  lang: string;
}
