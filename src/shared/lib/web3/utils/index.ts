import nacl from 'tweetnacl';
import bs58 from 'bs58';

export const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error('missing shared secret');

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret);

  return [nonce, encryptedPayload];
};
export const decryptPayload = (data: string | null, nonce: string | null, sharedSecret?: Uint8Array | null) => {
  if (!sharedSecret || !data || !nonce) {
    throw new Error('missing shared secret');
  }

  const decryptedData = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecret);
  if (!decryptedData) {
    throw new Error('Unable to decrypt data');
  }
  return JSON.parse(Buffer.from(decryptedData).toString('utf8'));
};

export function fixUrlParams(url: string): string {
  return url.replace(/\?(?=[^?]*=)/g, (_, offset, str) => (offset === str.indexOf('?') ? '?' : '&'));
}

export const buildUrl = (wallet: string, path: string, params: URLSearchParams) =>
  `${wallet}${path}?${params.toString()}`;

export const getKeyFromParams = (paramKey: string, storageValue: Uint8Array | null): Uint8Array | null => {
  const params = new URLSearchParams(window.location.search);
  const paramValue = params.get(paramKey);
  if (!paramValue) return storageValue;

  return bs58.decode(paramValue);
};
