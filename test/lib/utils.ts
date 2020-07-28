import { promisify } from 'util';
import * as fs from 'fs';

export const files = {
  readFile: promisify(fs.readFile),
};
