/* eslint-disable @typescript-eslint/no-misused-promises */
// node_modules
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// libraries
import { promisify } from 'util';
import { env } from '../environment';

// file constants
const algorithm = 'aes-256-cbc';

/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String} secret
 * @return {String}
 * @api private
 */
export function sign(val: string, secret: string) {
  if (typeof val !== 'string') throw new TypeError('Cookie value must be provided as a string.');
  if (typeof secret !== 'string') throw new TypeError('Secret string must be provided.');
  return `${val}.${crypto
    .createHmac('sha256', secret)
    .update(val)
    .digest('base64')
    // eslint-disable-next-line no-useless-escape
    .replace(/\=+$/, '')}`;
}

/**
 * Unsign and decode the given `val` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} val
 * @param {String} secret
 * @return {String|Boolean}
 * @api private
 */

export function unsign(val: any, secret: string) {
  if (typeof val !== 'string') throw new TypeError('Signed cookie string must be provided.');
  if (typeof secret !== 'string') throw new TypeError('Secret string must be provided.');
  const str = val.slice(0, val.lastIndexOf('.'));
  const mac = exports.sign(str, secret);
  const macBuffer = Buffer.from(mac);
  const valBuffer = Buffer.alloc(macBuffer.length);
  valBuffer.write(val);
  return crypto.timingSafeEqual(macBuffer, valBuffer) ? str : false;
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(env.CRYPTOGRAPHY_KEY, 'base64'), iv);
  let encrypted: any = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  encrypted = `${iv.toString('hex')}:::${encrypted.toString('hex')}`;
  return encrypted;
}

export function decrypt(text: string) {
  const [
    iv,
    encrypted,
  ] = text.split(':::');
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedText = Buffer.from(encrypted, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(env.CRYPTOGRAPHY_KEY, 'base64'), ivBuffer);
  let decrypted: any = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  decrypted = decrypted.toString();
  return decrypted;
}

export const password = bcrypt;
