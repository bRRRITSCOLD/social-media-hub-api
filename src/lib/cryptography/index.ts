/**
 * Module dependencies.
 */

import crypto from 'crypto';
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
