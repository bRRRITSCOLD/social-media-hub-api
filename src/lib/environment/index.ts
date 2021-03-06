import { Environment, EnvironmentInterface } from './environment';

export interface EnvInterface extends EnvironmentInterface {
  // user supplied env vars
  PORT: number;
  ALLOWED_ORIGINS: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  CRYPTOGRAPHY_KEY: string;
  TWITTER_OAUTH_CLIENT_NAME: string;
  TIWTTER_CONSUMER_KEY: string;
  TIWTTER_CONSUMER_SECRET: string;
  TIWTTER_OAUTH_CALLBACK_URL: string;
  TWITTER_BEARER_TOKEN: string;
  MONGO_SOCIAL_MEDIA_HUB_DB_HOST: string;
  MONGO_SOCIAL_MEDIA_HUB_DB_PORT: number;
  MONGO_SOCIAL_MEDIA_HUB_DB_NAME: string;
  MONGO_SOCIAL_MEDIA_HUB_API_USER: string;
  MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD: string;
  MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME: string;
  MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME: string;
  DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME: string;
  // computed env vars
  isLocal: boolean;
  // "static"/harcoded env vars
  AWS_DYNAMODB_LOCALSTACK_ENDPOINT: string;
}

export class Env extends Environment implements EnvInterface {
  // user supplied env vars
  public get PORT(): number {
    return +(process.env.PORT as string);
  }
  public set PORT(value: number) {
    process.env.PORT = `${value}`;
  }
  public get ALLOWED_ORIGINS(): string {
    return process.env.ALLOWED_ORIGINS as string;
  }
  public set ALLOWED_ORIGINS(value: string) {
    process.env.ALLOWED_ORIGINS = `${value}`;
  }
  public get JWT_SECRET(): string {
    return process.env.JWT_SECRET as string;
  }
  public set JWT_SECRET(value: string) {
    process.env.JWT_SECRET = `${value}`;
  }
  public get COOKIE_SECRET(): string {
    return process.env.COOKIE_SECRET as string;
  }
  public set COOKIE_SECRET(value: string) {
    process.env.COOKIE_SECRET = `${value}`;
  }
  public get CRYPTOGRAPHY_KEY(): string {
    return process.env.CRYPTOGRAPHY_KEY as string;
  }
  public set CRYPTOGRAPHY_KEY(value: string) {
    process.env.CRYPTOGRAPHY_KEY = `${value}`;
  }
  public get TWITTER_OAUTH_CLIENT_NAME(): string {
    return process.env.TWITTER_OAUTH_CLIENT_NAME as string;
  }
  public set TWITTER_OAUTH_CLIENT_NAME(value: string) {
    process.env.TWITTER_OAUTH_CLIENT_NAME = `${value}`;
  }
  public get TIWTTER_CONSUMER_KEY(): string {
    return process.env.TIWTTER_CONSUMER_KEY as string;
  }
  public set TIWTTER_CONSUMER_KEY(value: string) {
    process.env.TIWTTER_CONSUMER_KEY = `${value}`;
  }
  public get TIWTTER_CONSUMER_SECRET(): string {
    return process.env.TIWTTER_CONSUMER_SECRET as string;
  }
  public set TIWTTER_CONSUMER_SECRET(value: string) {
    process.env.TIWTTER_CONSUMER_SECRET = `${value}`;
  }
  public get TIWTTER_OAUTH_CALLBACK_URL(): string {
    return process.env.TIWTTER_OAUTH_CALLBACK_URL as string;
  }
  public set TIWTTER_OAUTH_CALLBACK_URL(value: string) {
    process.env.TIWTTER_OAUTH_CALLBACK_URL = `${value}`;
  }
  public get TWITTER_BEARER_TOKEN(): string {
    return process.env.TWITTER_BEARER_TOKEN as string;
  }
  public set TWITTER_BEARER_TOKEN(value: string) {
    process.env.TWITTER_BEARER_TOKEN = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_DB_HOST(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_DB_HOST as string;
  }
  public set MONGO_SOCIAL_MEDIA_HUB_DB_HOST(value: string) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_DB_HOST = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_DB_PORT(): number {
    return +(process.env.MONGO_SOCIAL_MEDIA_HUB_DB_PORT as string);
  }
  public set MONGO_SOCIAL_MEDIA_HUB_DB_PORT(value: number) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_DB_PORT = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_DB_NAME(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME as string;
  }
  public set MONGO_SOCIAL_MEDIA_HUB_DB_NAME(value: string) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_API_USER(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_API_USER as string;
  }
  public set MONGO_SOCIAL_MEDIA_HUB_API_USER(value: string) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_API_USER = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD as string;
  }
  public set MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD(value: string) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME as string;
  }
  public set MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME(value: string) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_USERS_COLLECTION_NAME = `${value}`;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME as string;
  }
  public set MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME(value: string) {
    process.env.MONGO_SOCIAL_MEDIA_HUB_USER_TOKENS_COLLECTION_NAME = `${value}`;
  }
  public get DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME(): string {
    return process.env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME as string;
  }
  public set DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME(value: string) {
    process.env.DYNAMODB_SOCIAL_MDEIA_HUB_SCHEDULED_TWITTER_TWEETS_TABLE_NAME = `${value}`;
  }
  // computed values
  public get isLocal(): boolean {
    return this.NODE_ENV.toUpperCase() === 'LOCAL';
  }
  // "static"/hardcoded values
  public get AWS_DYNAMODB_LOCALSTACK_ENDPOINT(): string {
    return 'http://localhost:4569';
  }
}

const env = new Env();

export { env };
