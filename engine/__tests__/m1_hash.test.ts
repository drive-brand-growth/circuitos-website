import { createHash, createHmac } from 'node:crypto';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hmacSha256Hex, sha256Hex } from '../hash';

describe('M1 hash helpers match the platform implementation', () => {
  it('sha256_known_vectors', () => {
    expect(sha256Hex(new Uint8Array())).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256Hex(new TextEncoder().encode('abc'))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('sha256_and_hmac_agree_with_node_crypto', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 300 }), fc.string({ maxLength: 100 }), fc.string({ maxLength: 100 }), (bytes, key, msg) => {
        expect(sha256Hex(bytes)).toBe(createHash('sha256').update(bytes).digest('hex'));
        expect(hmacSha256Hex(key, msg)).toBe(createHmac('sha256', key).update(msg).digest('hex'));
      }),
      { numRuns: 200 },
    );
  });
});
