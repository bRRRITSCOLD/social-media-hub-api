import { OutgoingHttpHeaders } from 'http';
import * as oauthh from 'oauth';
import * as _ from 'lodash';

// file constants
type OAuth = oauthh.OAuth;
type OAuth2 = oauthh.OAuth2;
type OAuthEcho = oauthh.OAuthEcho;

export interface OAuthConfigurationOptionsInterface {
  requestUrl: string;
  accessUrl: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
  authorize_callback: string | null;
  signatureMethod: string;
  nonceSize?: number | undefined;
  customHeaders?: OutgoingHttpHeaders | undefined;
}

export class OAuthConfigurationOptions implements OAuthConfigurationOptionsInterface {
  public requestUrl!: string;
  public accessUrl!: string;
  public consumerKey!: string;
  public consumerSecret!: string;
  public version!: string;
  public authorize_callback!: string | null;
  public signatureMethod!: string;
  public nonceSize?: number | undefined;
  public customHeaders?: OutgoingHttpHeaders | undefined;

  public constructor(oAuthConfigurationOptions: OAuthConfigurationOptionsInterface) {
    _.assign(this, {
      ...oAuthConfigurationOptions,
      requestUrl: _.get(oAuthConfigurationOptions, 'requestUrl'),
      accessUrl: _.get(oAuthConfigurationOptions, 'accessUrl'),
      consumerKey: _.get(oAuthConfigurationOptions, 'consumerKey'),
      consumerSecret: _.get(oAuthConfigurationOptions, 'consumerSecret'),
      version: _.get(oAuthConfigurationOptions, 'version'),
      authorize_callback: _.get(oAuthConfigurationOptions, 'authorize_callback'),
      signatureMethod: _.get(oAuthConfigurationOptions, 'signatureMethod'),
      nonceSize: _.get(oAuthConfigurationOptions, 'nonceSize'),
      customHeaders: _.get(oAuthConfigurationOptions, 'customHeaders'),
    });
  }
}

export interface OAuthConfigurationInterface {
  name: string;
  options: OAuthConfigurationOptionsInterface;
}

export class OAuthConfiguration implements OAuthConfigurationInterface {
  public name!: string;
  public options!: OAuthConfigurationOptions;

  public constructor(oAuthConfiguration: OAuthConfigurationInterface) {
    _.assign(this, {
      ...oAuthConfiguration,
      name: _.get(oAuthConfiguration, 'name'),
      options: new OAuthConfigurationOptions(_.get(oAuthConfiguration, 'options')),
    });
  }
}

export interface OAuthInterface {
  clients: {
    [key: string]: {
      client: oauthh.OAuth | oauthh.OAuth2 | oauthh.OAuthEcho;
      configuration: OAuthConfiguration;
    }
  };
}

export class OAuthConnector {
  public clients!: {
    [key: string]: {
      client: any;
      configuration: OAuthConfiguration;
    }
  };

  public init(configurations: OAuthConfigurationInterface[]): void {
    this.clients = configurations.reduce((
      configs: {
        [key: string]: {
          client: oauthh.OAuth | oauthh.OAuth2 | oauthh.OAuthEcho;
          configuration: OAuthConfiguration;
        }
      },
      configuration: OAuthConfigurationInterface,
    ) => {
      const oAuthConfiguration = new OAuthConfiguration(configuration);
      switch (configuration.options.version.toUpperCase()) {
        case '1.0A': {
          configs[configuration.name] = {
            client: new oauthh.OAuth(
              oAuthConfiguration.options.requestUrl,
              oAuthConfiguration.options.accessUrl,
              oAuthConfiguration.options.consumerKey,
              oAuthConfiguration.options.consumerSecret,
              oAuthConfiguration.options.version,
              oAuthConfiguration.options.authorize_callback,
              oAuthConfiguration.options.signatureMethod,
            ),
            configuration: oAuthConfiguration,
          };
          break;
        }
        default: {
          break;
        }
      }
      return configs;
    }, {});
    // return explicitly
  }

  public getClient(name: string): any {
    return this.clients[name].client;
  }
}

const oAuthConnector = new OAuthConnector();

export {
  oAuthConnector, OAuth, OAuthEcho, OAuth2,
};
