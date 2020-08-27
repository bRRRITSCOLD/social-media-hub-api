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
    super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.integration.test.example',
        path: './.env.integration.test',
      },
    });
  }
}

export class IntegrationTwitterTestEnv extends Env implements IntegrationTestEnvInterface {
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
    super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.integration.test.example',
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
    super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.e2e.test.example',
        path: './.env.e2e.test',
      },
    });
  }
}

export class E2ETwitterTestEnv extends Env implements E2ETestEnvInterface {
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
    super.init({
      ...require('../../src/configs/environment').default,
      options: {
        example: './.env.e2e.test.example',
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
