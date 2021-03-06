export interface TwitterUserInterface {
  id: number;
  idStr: string;
  name: string;
  screenName: string;
  location: string;
  description: string;
  url: string;
  protected: boolean;
  followersCount: number;
  friendsCount: number;
  listedCount: number;
  createdAt: string;
  favouritesCount: number;
  utcOffset?: string | null;
  timeZone?: string | null;
  geoEnabled: boolean;
  verified: boolean;
  statusesCount: number;
  lang?: string | null;
  contributorsEnabled: boolean;
  isTranslator: boolean;
  isTranslationEnabled: boolean;
  profileBackgroundColor: string;
  profileBackgroundImageUrl: string;
  profileBackgroundImageUrlHttps: string;
  profileBackgroundTile: boolean;
  profileImageUrl: string;
  profileImageUrlHttps: string;
  profileBannerUrl: string;
  profileLinkColor: string;
  profileSidebarBorderColor: string;
  profileSidebarFillColor: string;
  profileTextColor: string;
  profileUseBackgroundImage: boolean;
  hasExtendedProfile: boolean;
  defaultProfile: boolean;
  defaultProfileImage: boolean;
  following: boolean;
  followRequestSent: boolean;
  notifications: boolean;
  translatorType: string;
}
