import { Environment, EnvironmentInterface } from '../../src/lib/environment/environment';

export interface TestEnvInterface extends EnvironmentInterface {
  EMAIL_ADDRESS: string;
  PASSWORD: string;
}

export class TestEnv extends Environment implements TestEnvInterface {
  // non-computed values
  public get EMAIL_ADDRESS(): string {
    return process.env.EMAIL_ADDRESS as string;
  }
  public set EMAIL_ADDRESS(value: string) {
    process.env.EMAIL_ADDRESS = `${value}`;
  }

  public get PASSWORD(): string {
    return process.env.PASSWORD as string;
  }
  public set PASSWORD(value: string) {
    process.env.PASSWORD = `${value}`;
  }
}

const testEnv = new TestEnv();

export { testEnv };
