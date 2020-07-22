import { Environment, EnvironmentInterface } from './environment';

export interface EnvInterface extends EnvironmentInterface {
  PORT: string;
  TIWTTER_CONSUMER_KEY: string;
  TIWTTER_CONSUMER_SECRET: string;
  TIWTTER_ACCESS_TOKEN: string;
  TIWTTER_ACCESS_TOKEN_SECRET: string;
}

export class Env extends Environment implements EnvInterface {
  // non-computed values
  public get PORT(): string {
    return process.env.PORT as string;
  }
  public get TIWTTER_CONSUMER_KEY(): string {
    return process.env.TIWTTER_CONSUMER_KEY as string;
  }
  public get TIWTTER_CONSUMER_SECRET(): string {
    return process.env.TIWTTER_CONSUMER_SECRET as string;
  }
  public get TIWTTER_ACCESS_TOKEN(): string {
    return process.env.TIWTTER_ACCESS_TOKEN as string;
  }
  public get TIWTTER_ACCESS_TOKEN_SECRET(): string {
    return process.env.TIWTTER_ACCESS_TOKEN_SECRET as string;
  }
  // computed values
  public get isLocal() {
    return this.NODE_ENV.toUpperCase() === 'LOCAL';
  }
}

const env = new Env();

export { env };
