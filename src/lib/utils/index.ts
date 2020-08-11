import jsonStringifySafe from 'json-stringify-safe';

export const anyy = {
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

export const booleans = {
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

export const enumerations = {
  enumerate(enumm: any) {
    return Object.keys(enumm).map((key: any) => enumm[key]);
  },
};
