import jsonStringifySafe from 'json-stringify-safe';
import { promisify } from 'util';
import * as fs from 'fs';
import * as _ from 'lodash';

const toCamelCase = (str: any) => {
  return _.camelCase(str);
};

const toSnakeCase = (str: any) => {
  return _.snakeCase(str);
};

const toPascalCase = (str: any) => {
  return _.upperFirst(_.camelCase(str));
};

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const camelCaseKeys = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[toCamelCase(k)] = camelCaseKeys(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return camelCaseKeys(i);
    });
  }

  return o;
};

const snakeCaseKeys = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[toSnakeCase(k)] = snakeCaseKeys(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return snakeCaseKeys(i);
    });
  }

  return o;
};

const pascalCaseKeys = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[toPascalCase(k)] = pascalCaseKeys(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return pascalCaseKeys(i);
    });
  }

  return o;
};

const files = {
  readFile: promisify(fs.readFile),
};

const anyy = {
  stringify(
    item: any,
    options: {
      native?: boolean;
      replacer?: ((this: any, key: string, value: any) => any) | undefined;
      space?: string | number | undefined;
    } = {},
  ): string {
    // deconstruct for east
    const { native, replacer, space } = options;
    // if native use native JSON.stringify
    if (native) return JSON.stringify(item, replacer, space);
    // else use the json-stringify-safe library
    return jsonStringifySafe(item);
  },
};

const booleans = {
  fromOther(booleanLikeValue: any): boolean {
    switch (booleanLikeValue) {
      case '1':
      case 1:
      case 'true':
      case true: {
        return true;
      }
      case '0':
      case 0:
      case 'false':
      case false: {
        return false;
      }
      default: {
        return undefined as unknown as boolean;
      }
    }
  },
};

const enumerations = {
  enumerate(enumm: any) {
    return Object.keys(enumm).map((key: any) => enumm[key]);
  },
};

const arrays = {
  isArray,
  camelCaseKeys,
  snakeCaseKeys,
  pascalCaseKeys,
};

const objects = {
  isObject,
  camelCaseKeys,
  snakeCaseKeys,
  pascalCaseKeys,
};

const utils = {
  anyy,
  booleans,
  enumerations,
  arrays,
  objects,
  files,
};

export { utils };
