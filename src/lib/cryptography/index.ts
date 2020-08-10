/* eslint-disable @typescript-eslint/no-misused-promises */
// node_modules
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// libraries
import { promisify } from 'util';
import { env } from '../environment';

// file constants

const ALGORITHM = {

  /**
     * GCM is an authenticated encryption mode that
     * not only provides confidentiality but also
     * provides integrity in a secured way
     * */
  BLOCK_CIPHER: 'aes-256-gcm',

  /**
     * 128 bit auth tag is recommended for GCM
     */
  AUTH_TAG_BYTE_LEN: 16,

  /**
     * NIST recommends 96 bits or 12 bytes IV for GCM
     * to promote interoperability, efficiency, and
     * simplicity of design
     */
  IV_BYTE_LEN: 12,

  /**
     * Note: 256 (in algorithm name) is key size.
     * Block size for AES is always 128
     */
  KEY_BYTE_LEN: 32,

  /**
     * To prevent rainbow table attacks
     * */
  SALT_BYTE_LEN: 16,
};

export const getIV = () => crypto.randomBytes(ALGORITHM.IV_BYTE_LEN);
export const getRandomKey = () => crypto.randomBytes(ALGORITHM.KEY_BYTE_LEN);

/**
 * To prevent rainbow table attacks
 * */
export const getSalt = () => crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN);

/**
 *
 * @param {Buffer} password - The password to be used for generating key
 *
 * To be used when key needs to be generated based on password.
 * The caller of this function has the responsibility to clear
 * the Buffer after the key generation to prevent the password
 * from lingering in the memory
 */
export const getKeyFromPassword = (password: string, salt: string) => {
  return crypto.scryptSync(password, salt, ALGORITHM.KEY_BYTE_LEN);
};

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
  const iv = getIV();
  const cipher = (crypto as any).createCipheriv(
    ALGORITHM.BLOCK_CIPHER, Buffer.from(env.CRYPTOGRAPHY_KEY, 'base64'), iv, { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN },
  );
  let encryptedMessage = cipher.update(text);
  encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
  return `${iv.toString('base64')}:${encryptedMessage.toString('base64')}}`;
}

/**
 *
 *
 * @param {string} text
 * @returns
 */
export function decrypt(text: string) {
  const authTag = text.slice(-16);
  const iv = text.slice(0, 12);
  const encryptedMessage = text.slice(12, -16);
  const decipher = (crypto as any).createDecipheriv(
    ALGORITHM.BLOCK_CIPHER, env.CRYPTOGRAPHY_KEY, iv, { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN },
  );
  decipher.setAuthTag(authTag);
  let messagetext = decipher.update(encryptedMessage);
  messagetext = Buffer.concat([messagetext, decipher.final()]);
  messagetext = messagetext.toString();
  return messagetext;
}

export const password = bcrypt;
