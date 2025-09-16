const lookup: string[] = [];
for (let i = 0; i < 256; i++) {
  lookup[i] = i.toString(16).padStart(2, '0');
}

export const bytesToHex = (bytes: Uint8Array): string => {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError('Input must be a Uint8Array');
  }

  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += lookup[bytes[i]];
  }
  return hex;
};
