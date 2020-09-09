import { Env, EnvInterface } from '../../src/lib/environment';

export interface IntegrationTestEnvInterface extends EnvInterface {
  EMAIL_ADDRESS: string;
  PASSWORD: string;
}

export class IntegrationTestEnv extends Env implements IntegrationTestEnvInterface {
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

  public async init(): Promise<void> {
    await super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.integration.test.example',
        path: './.env.integration.test',
      },
    });
  }
}

export interface IntegrationTwitterTestEnvInterface extends EnvInterface {
  EMAIL_ADDRESS: string;
  PASSWORD: string;
  TIWTTER_ACCESS_TOKEN: string;
  TIWTTER_ACCESS_TOKEN_SECRET: string;
}

export class IntegrationTwitterTestEnv extends Env implements IntegrationTwitterTestEnvInterface {
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

  public get TIWTTER_ACCESS_TOKEN(): string {
    return process.env.TIWTTER_ACCESS_TOKEN as string;
  }
  public set TIWTTER_ACCESS_TOKEN(value: string) {
    process.env.TIWTTER_ACCESS_TOKEN = `${value}`;
  }

  public get TIWTTER_ACCESS_TOKEN_SECRET(): string {
    return process.env.TIWTTER_ACCESS_TOKEN_SECRET as string;
  }
  public set TIWTTER_ACCESS_TOKEN_SECRET(value: string) {
    process.env.TIWTTER_ACCESS_TOKEN_SECRET = `${value}`;
  }

  public async init(): Promise<void> {
    await super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.integration.twitter.test.example',
        path: './.env.integration.twitter.test',
      },
    });
  }
}

export interface E2ETestEnvInterface extends EnvInterface {
  EMAIL_ADDRESS: string;
  PASSWORD: string;
}

export class E2ETestEnv extends Env implements E2ETestEnvInterface {
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

  public async init(): Promise<void> {
    await super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.e2e.test.example',
        path: './.env.e2e.test',
      },
    });
  }
}

export interface E2ETwitterTestEnvInterface extends EnvInterface {
  EMAIL_ADDRESS: string;
  PASSWORD: string;
  TIWTTER_ACCESS_TOKEN: string;
  TIWTTER_ACCESS_TOKEN_SECRET: string;
  TIWTTER_SCREEN_NAME: string;
  TIWTTER_USER_ID: string;
}

export class E2ETwitterTestEnv extends Env implements E2ETwitterTestEnvInterface {
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

  public get TIWTTER_ACCESS_TOKEN(): string {
    return process.env.TIWTTER_ACCESS_TOKEN as string;
  }
  public set TIWTTER_ACCESS_TOKEN(value: string) {
    process.env.TIWTTER_ACCESS_TOKEN = `${value}`;
  }

  public get TIWTTER_ACCESS_TOKEN_SECRET(): string {
    return process.env.TIWTTER_ACCESS_TOKEN_SECRET as string;
  }
  public set TIWTTER_ACCESS_TOKEN_SECRET(value: string) {
    process.env.TIWTTER_ACCESS_TOKEN_SECRET = `${value}`;
  }

  public get TIWTTER_SCREEN_NAME(): string {
    return process.env.TIWTTER_SCREEN_NAME as string;
  }
  public set TIWTTER_SCREEN_NAME(value: string) {
    process.env.TIWTTER_SCREEN_NAME = `${value}`;
  }

  public get TIWTTER_USER_ID(): string {
    return process.env.TIWTTER_USER_ID as string;
  }
  public set TIWTTER_USER_ID(value: string) {
    process.env.TIWTTER_USER_ID = `${value}`;
  }

  public async init(): Promise<void> {
    await super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.e2e.twitter.test.example',
        path: './.env.e2e.twitter.test',
      },
    });
  }
}

const integrationTestEnv = new IntegrationTestEnv();
const integrationTwitterTestEnv = new IntegrationTwitterTestEnv();
const e2eTestEnv = new E2ETestEnv();
const e2eTwitterTestEnv = new E2ETwitterTestEnv();

export {
  integrationTestEnv, integrationTwitterTestEnv, e2eTestEnv, e2eTwitterTestEnv,
};
