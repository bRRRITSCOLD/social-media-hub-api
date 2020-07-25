// node_modules
import crypto from 'crypto';

// libraries
import { env } from '../environment';

// file constants
const encryptDecryptAlgorithm = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

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

/**
 *
 *
 * @param {string} text
 * @returns
 */
export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(encryptDecryptAlgorithm, Buffer.from(env.CRYPTOGRAPHY_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 *
 *
 * @param {string} text
 * @returns
 */
export function decrypt(text: string) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() as any, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(encryptDecryptAlgorithm, Buffer.from(env.CRYPTOGRAPHY_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
