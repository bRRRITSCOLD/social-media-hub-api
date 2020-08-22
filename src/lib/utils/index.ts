import jsonStringifySafe from 'json-stringify-safe';

const snakeToCamel = (s: any) => {
  return s.replace(/([-_][a-z])/ig, ($1: any) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const camelToSnake = (str: any) => {
  return str.replace(/[A-Z]/g, (letter: any) => {
    return `_${letter.toLowerCase()}`;
  });
};

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const snakeKeysToCamel = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[snakeToCamel(k)] = snakeKeysToCamel(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return snakeKeysToCamel(i);
    });
  }

  return o;
};

const camelKeysToSnake = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[camelToSnake(k)] = camelKeysToSnake(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return camelKeysToSnake(i);
    });
  }

  return o;
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
  snakeKeysToCamel,
  camelKeysToSnake,
};

const objects = {
  isObject,
  snakeKeysToCamel,
  camelKeysToSnake,
};

const utils = {
  anyy,
  booleans,
  enumerations,
  arrays,
  objects,
};

export { utils };
