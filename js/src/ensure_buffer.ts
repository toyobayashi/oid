import { isAnyArrayBuffer } from './parser/utils'
import { bufferFrom } from './util/buffer'

/**
 * Makes sure that, if a Uint8Array is passed in, it is wrapped in a Buffer.
 *
 * @param potentialBuffer - The potential buffer
 * @returns Buffer the input if potentialBuffer is a buffer, or a buffer that
 * wraps a passed in Uint8Array
 * @throws TypeError If anything other than a Buffer or Uint8Array is passed in
 */
export function ensureBuffer (potentialBuffer: Uint8Array | ArrayBufferView | ArrayBuffer): Uint8Array | number[] {
  if (typeof ArrayBuffer === 'function' && typeof Uint8Array === 'function' && ArrayBuffer?.isView(potentialBuffer)) {
    const original = new Uint8Array(
      potentialBuffer.buffer,
      potentialBuffer.byteOffset,
      potentialBuffer.byteLength
    )
    return original
  }

  if (isAnyArrayBuffer(potentialBuffer)) {
    return bufferFrom(potentialBuffer)
  }

  throw new TypeError('Must use either ArrayBuffer or TypedArray')
}
