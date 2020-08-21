import jsonStringifySafe from 'json-stringify-safe';

const toCamel = (s: any) => {
  return s.replace(/([-_][a-z])/ig, ($1: any) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const keysToCamel = function (o: any) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k: any) => {
        (n as any)[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } if (isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i);
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
  keysToCamel,
};

const objects = {
  keysToCamel,
};

const utils = {
  anyy,
  booleans,
  enumerations,
  arrays,
  objects,
};

export { utils };
