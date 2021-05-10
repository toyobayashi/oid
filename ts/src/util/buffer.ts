import { tryGetRequireFunction } from '../util/require'

const _require = tryGetRequireFunction()

// eslint-disable-next-line @typescript-eslint/naming-convention
let __Buffer: undefined | typeof import('buffer').Buffer

if (typeof _require === 'function') {
  try {
    __Buffer = _require('buffer').Buffer
  } catch (_) {}
}

function numberIsNaN (obj: any): obj is number {
  if (Number.isNaN) {
    return Number.isNaN(obj)
  }
  return typeof obj === 'number' && isNaN(obj)
}

const toString = Object.prototype.toString

function isArray (o: unknown): o is any[] {
  if (Array.isArray) {
    return Array.isArray(o)
  }
  return (toString.call(o) === '[object Array]')
}

export function isBufferOrArray (o: unknown): o is Uint8Array | number[] {
  return (typeof Uint8Array !== 'undefined' && o instanceof Uint8Array) || (toString.call(o) === '[object Uint8Array]') || isArray(o)
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

export function bufferFrom (buf: string | ArrayBuffer | Uint8Array | number[]): Uint8Array | number[] {
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
        const origin = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
        const uint8arr = new Uint8Array(buf.byteLength)
        for (i = 0; i < buf.byteLength; i++) {
          uint8arr[i] = origin[i]
        }
        return uint8arr
      }
    }
    if (isArray(buf)) {
      if (typeof Uint8Array.from === 'function') {
        return Uint8Array.from(buf)
      } else {
        return new Uint8Array(buf)
      }
    }
    if (typeof buf === 'string') {
      const bytes = utf8ToBytes(buf)
      return bufferFrom(bytes)
    }
  }

  if (typeof buf === 'string') {
    return utf8ToBytes(buf)
  }

  const arr = []
  for (i = 0; i < (buf as any).length; i++) {
    arr[i] = (buf as any)[i]
  }
  return arr
}

export function bufferFromHex (buf: string): Uint8Array | number[] {
  if (__Buffer) {
    return __Buffer.from(buf, 'hex')
  }
  let arr: Uint8Array | number[]
  if (typeof Uint8Array === 'function') {
    arr = new Uint8Array(Math.floor(buf.length / 2))
  } else {
    arr = new Array(Math.floor(buf.length / 2))
  }

  hexWrite(arr, buf)

  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(buf.substring(i * 2, i * 2 + 2), 16)
  }
  return arr
}

export function readUInt32BE (this: Uint8Array | number[], offset: number = 0): number {
  if (__Buffer?.isBuffer(this)) {
    return this.readUInt32BE(offset)
  }
  const type = typeof offset
  if (type !== 'number') {
    throw new TypeError('The offset argument must be of type number. Received type ' + type)
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

export function readInt32BE (this: Uint8Array | number[], offset: number = 0): number {
  if (__Buffer?.isBuffer(this)) {
    return this.readInt32BE(offset)
  }
  const type = typeof offset
  if (type !== 'number') {
    throw new TypeError('The offset argument must be of type number. Received type ' + type)
  }
  const first = this[offset]
  const last = this[offset + 3]
  if (first === undefined || last === undefined) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  return (first << 24) + // Overflow
    this[++offset] * Math.pow(2, 16) +
    this[++offset] * Math.pow(2, 8) +
    last
}

function checkInt (value: number, min: number, max: number, buf: Uint8Array | number[], offset: number, byteLength: number): void {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || (typeof BigInt === 'function' ? (BigInt(min) === BigInt(0)) : false)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new RangeError('value' + range)
  }
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function writeU_Int32BE (buf: Uint8Array | number[], value: number, offset: number, min: number, max: number): number {
  value = +value
  checkInt(value, min, max, buf, offset, 3)

  buf[offset + 3] = value & 0xff
  value = value >>> 8
  buf[offset + 2] = value & 0xff
  value = value >>> 8
  buf[offset + 1] = value & 0xff
  value = value >>> 8
  buf[offset] = value & 0xff
  return offset + 4
}

export function writeUInt32BE (this: Uint8Array | number[], value: number, offset = 0): number {
  return writeU_Int32BE(this, value, offset, 0, 0xffffffff)
}

export function bufferEquals (this: Uint8Array | number[], target: Uint8Array | number[]): boolean {
  if (!isBufferOrArray(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }
  if (this === target) return true
  if (this.length !== target.length) return false
  for (let i = 0; i < this.length; i++) {
    if (this[i] !== target[i]) return false
  }
  return true
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
  } else if (encoding === 'binary' || encoding === 'latin1') {
    res = ''
    for (i = 0; i < this.length; i++) {
      res += String.fromCharCode((this[i] >>> 0) & 0xff)
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

function utf8ToBytes (string: string, units = Infinity): number[] {
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function hexWrite (buf: Uint8Array | number[], string: string, offset = 0): number {
  const remaining = buf.length - offset
  let length = remaining

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i: number
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substring(i * 2, i * 2 + 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}
