import { Environment, EnvironmentInterface } from './environment';

export interface EnvInterface extends EnvironmentInterface {
  PORT: number;
  TIWTTER_CONSUMER_KEY: string;
  TIWTTER_CONSUMER_SECRET: string;
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

  // computed values
  public get isLocal() {
    return this.NODE_ENV.toUpperCase() === 'LOCAL';
  }
}

const env = new Env();

export { env };
