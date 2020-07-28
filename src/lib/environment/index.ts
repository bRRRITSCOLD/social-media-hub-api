import { Environment, EnvironmentInterface } from './environment';

export interface EnvInterface extends EnvironmentInterface {
  PORT: number;
  ALLOWED_ORIGINS: string;
  COOKIE_SECRET: string;
  CRYPTOGRAPHY_KEY: string;
  TWITTER_OAUTH_CLIENT_NAME: string;
  TIWTTER_CONSUMER_KEY: string;
  TIWTTER_CONSUMER_SECRET: string;
  TIWTTER_OAUTH_CALLBACK_URL: string;
  TWITTER_BEARER_TOKEN: string;
  MONGO_SOCIAL_MEDIA_HUB_DB_HOST: string;
  MONGO_SOCIAL_MEDIA_HUB_DB_NAME: string;
  MONGO_SOCIAL_MEDIA_HUB_API_USER: string;
  MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD: string;
  MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME: string;
}

export class Env extends Environment implements EnvInterface {
  // non-computed values
  public get PORT(): number {
    return +(process.env.PORT as string);
  }
  public get ALLOWED_ORIGINS(): string {
    return process.env.ALLOWED_ORIGINS as string;
  }
  public get COOKIE_SECRET(): string {
    return process.env.COOKIE_SECRET as string;
  }
  public get CRYPTOGRAPHY_KEY(): string {
    return process.env.CRYPTOGRAPHY_KEY as string;
  }
  public get TWITTER_OAUTH_CLIENT_NAME(): string {
    return process.env.TWITTER_OAUTH_CLIENT_NAME as string;
  }
  public get TIWTTER_CONSUMER_KEY(): string {
    return process.env.TIWTTER_CONSUMER_KEY as string;
  }
  public get TIWTTER_CONSUMER_SECRET(): string {
    return process.env.TIWTTER_CONSUMER_SECRET as string;
  }
  public get TIWTTER_OAUTH_CALLBACK_URL(): string {
    return process.env.TIWTTER_OAUTH_CALLBACK_URL as string;
  }
  public get TWITTER_BEARER_TOKEN(): string {
    return process.env.TWITTER_BEARER_TOKEN as string;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_DB_HOST(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_DB_HOST as string;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_DB_NAME(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME as string;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_API_USER(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_API_USER as string;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD as string;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME as string;
  }

  // computed values
  public get isLocal(): boolean {
    return this.NODE_ENV.toUpperCase() === 'LOCAL';
  }
}

const env = new Env();

export { env };
