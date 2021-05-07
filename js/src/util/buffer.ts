import { tryGetRequireFunction } from '../util/require'

const _require = tryGetRequireFunction(module)

// eslint-disable-next-line @typescript-eslint/naming-convention
let __Buffer: undefined | typeof import('buffer').Buffer

if (typeof _require === 'function') {
  __Buffer = _require('buffer')
}

const toString = Object.prototype.toString

export function isArray (o: unknown): o is any[] {
  if (Array.isArray) {
    return Array.isArray(o)
  }
  return (toString.call(o) === '[object Array]')
}

export function isArrayLike (o: unknown): o is ArrayLike<any> {
  return (typeof Uint8Array !== 'undefined' && o instanceof Uint8Array) || isArray(o)
}

export function bufferAlloc (len: number): Uint8Array | number[] {
  if (__Buffer) {
    return __Buffer.alloc(len)
  }

  let i
  if (typeof Uint8Array !== 'undefined') {
    return new Uint8Array(len)
  }

  const arr = []
  for (i = 0; i < len; i++) {
    arr[i] = 0
  }

  return arr
}

export function bufferFrom (buf: ArrayBuffer | Uint8Array | number[]): Uint8Array | number[] {
  if (__Buffer) {
    return __Buffer.from(buf as any)
  }
  let i
  if (typeof ArrayBuffer === 'function') {
    if (buf instanceof ArrayBuffer) {
      return new Uint8Array(buf)
    }
    if (ArrayBuffer.isView?.(buf) || buf instanceof Uint8Array) {
      if (typeof Uint8Array.from === 'function') {
        return Uint8Array.from(buf)
      } else {
        const uint8arr = new Uint8Array(buf.length)
        for (i = 0; i < buf.length; i++) {
          uint8arr[i] = buf[i]
        }
        return uint8arr
      }
    }
  }

  const arr = []
  for (i = 0; i < (buf as any).length; i++) {
    arr[i] = (buf as any)[i]
  }
  return arr
}

export function readUInt32BE (this: Uint8Array | number[], offset?: number): number {
  offset = offset ?? 0
  if (__Buffer?.isBuffer(this)) {
    return this.readUInt32BE(offset)
  }
  const first = this[offset]
  const last = this[offset + 3]
  if (first === undefined || last === undefined) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  return first * Math.pow(2, 24) +
    this[++offset] * Math.pow(2, 16) +
    this[++offset] * Math.pow(2, 8) +
    last
}

export function bufferToString (this: Uint8Array | number[], encoding: BufferEncoding): string {
  if (__Buffer) {
    return __Buffer.from(this).toString(encoding)
  }
  let res = ''
  let i = 0
  if (encoding === 'hex') {
    res = ''
    for (i = 0; i < this.length; i++) {
      const hex = this[i].toString(16)
      res += (hex.length === 1 ? ('0' + hex) : hex)
    }
    return res
  } else if (encoding === 'binary') {
    res = ''
    for (i = 0; i < this.length; i++) {
      res += String.fromCharCode(this[i])
    }
    return res
  } else {
    let out, c
    let char2, char3

    out = ''
    const len = this.length
    i = 0
    while (i < len) {
      c = this[i++]
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c)
          break
        case 12: case 13:
          // 110x xxxx 10xx xxxx
          char2 = this[i++]
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx 10xx xxxx 10xx xxxx
          char2 = this[i++]
          char3 = this[i++]
          out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0))
          break
      }
    }

    return out
  }
}
