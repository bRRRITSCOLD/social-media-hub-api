import { Environment, EnvironmentInterface } from './environment';

export interface EnvInterface extends EnvironmentInterface {
  PORT: number;
  TIWTTER_CONSUMER_KEY: string;
  TIWTTER_CONSUMER_SECRET: string;
  TIWTTER_CALLBACK_URL: string;
  MONGO_SOCIAL_MEDIA_HUB_DB_HOST: string;
  MONGO_SOCIAL_MEDIA_HUB_DB_NAME: string;
  MONGO_SOCIAL_MEDIA_HUB_API_USER: string;
  MONGO_SOCIAL_MEDIA_HUB_PI_PASSWORD: string;
  MONGO_SOCIAL_MEDIA_HUB_TWITTER_CREDENTIALS_COLLECTION_NAME: string;
}

export class Env extends Environment implements EnvInterface {
  // non-computed values
  public get PORT(): number {
    return +(process.env.PORT as string) as number;
  }
  public get TIWTTER_CONSUMER_KEY(): string {
    return process.env.TIWTTER_CONSUMER_KEY as string;
  }
  public get TIWTTER_CONSUMER_SECRET(): string {
    return process.env.TIWTTER_CONSUMER_SECRET as string;
  }
  public get TIWTTER_CALLBACK_URL(): string {
    return process.env.TIWTTER_CALLBACK_URL as string;
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
  public get MONGO_SOCIAL_MEDIA_HUB_PI_PASSWORD(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_PI_PASSWORD as string;
  }
  public get MONGO_SOCIAL_MEDIA_HUB_TWITTER_CREDENTIALS_COLLECTION_NAME(): string {
    return process.env.MONGO_SOCIAL_MEDIA_HUB_TWITTER_CREDENTIALS_COLLECTION_NAME as string;
  }

  // computed values
  public get isLocal() {
    return this.NODE_ENV.toUpperCase() === 'LOCAL';
  }
}

const env = new Env();

export { env };
