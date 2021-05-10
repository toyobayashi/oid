import { Symbol } from './util/symbol'
import { ensureBuffer } from './ensure_buffer'
import { deprecate, randomBytes } from './parser/utils'
import { bufferAlloc, bufferEquals, bufferFrom, bufferFromHex, bufferToString, isBufferOrArray, readInt32BE, readUInt32BE, writeUInt32BE } from './util/buffer'
import { defValue, supportDefineProperty } from './util/def'

// constants
const PROCESS_UNIQUE = randomBytes(5)

// Regular expression that checks for hex value
const checkForHexRegExp = /^[0-9a-fA-F]{24}$/

// Precomputed hex table enables speedy hex string conversion
const hexTable: string[] = []
for (let i = 0; i < 256; i++) {
  hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16)
}

// Lookup tables
const decodeLookup: number[] = []
let i = 0
while (i < 10) decodeLookup[0x30 + i] = i++
while (i < 16) decodeLookup[0x41 - 10 + i] = decodeLookup[0x61 - 10 + i] = i++

/** @public */
export interface ObjectIdLike {
  id: string | Uint8Array
  __id?: string
  toHexString: () => string
}

/** @public */
export interface ObjectIdExtended {
  $oid: string
}

const kId = Symbol('id')

/**
 * A class representation of the BSON ObjectId type.
 * @public
 */
export class ObjectId {
  readonly _bsontype!: 'ObjectID'

  /** @internal */
  public static index = ~~(Math.random() * 0xffffff)

  public static cacheHexString: boolean

  /** ObjectId Bytes @internal */
  // private [kId]: Uint8Array

  /** ObjectId hexString cache @internal */
  private __id?: string

  /**
   * Create an ObjectId type
   *
   * @param id - Can be a 24 character hex string, 12 byte binary Buffer, or a number.
   */
  public constructor (id?: string | Uint8Array | number | ObjectIdLike | ObjectId) {
    if (!(this instanceof ObjectId)) return new ObjectId(id)

    // Duck-typing to support ObjectId from different npm packages
    if (id instanceof ObjectId) {
      (this as any)[kId] = id.id
      if ('__id' in id) {
        this.__id = id.__id
      }
    }

    if (typeof id === 'object' && id && 'id' in id) {
      if ('toHexString' in id && typeof id.toHexString === 'function') {
        (this as any)[kId] = bufferFromHex(id.toHexString())
      } else {
        (this as any)[kId] = typeof id.id === 'string' ? bufferFrom(id.id) : id.id
      }
    }

    // The most common use case (blank id, new objectId instance)
    if (id == null || typeof id === 'number') {
      // Generate a new id
      (this as any)[kId] = ObjectId.generate(typeof id === 'number' ? id : undefined)
      // If we are caching the hex string
      if (ObjectId.cacheHexString) {
        this.__id = bufferToString.call(this.id, 'hex')
      }
    }

    if (typeof ArrayBuffer === 'function' ? ((ArrayBuffer.isView?.(id) || id instanceof Uint8Array) && id.byteLength === 12) : false) {
      (this as any)[kId] = ensureBuffer(id as ArrayBufferView)
    }

    if (isBufferOrArray(id)) {
      if (id.length === 12) {
        (this as any)[kId] = bufferFrom(id)
      } else {
        throw new TypeError(
          'Argument passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters'
        )
      }
    }

    if (typeof id === 'string') {
      if (id.length === 12) {
        const bytes = bufferFrom(id)
        if (bytes.length === 12) {
          (this as any)[kId] = bytes
        } else {
          throw new TypeError(
            'Argument passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters'
          )
        }
      } else if (id.length === 24 && checkForHexRegExp.test(id)) {
        (this as any)[kId] = bufferFromHex(id)
      } else {
        throw new TypeError(
          'Argument passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters'
        )
      }
    }

    if (!supportDefineProperty) {
      this.id = (this as any)[kId]
      this.generationTime = readInt32BE.call(this.id, 0)
    }

    if (ObjectId.cacheHexString) {
      this.__id = bufferToString.call(this.id, 'hex')
    }
  }

  /**
   * The ObjectId bytes
   * @readonly
   */
  public readonly id!: Uint8Array

  /**
   * The generation time of this ObjectId instance
   * @deprecated Please use getTimestamp / createFromTime which returns an int32 epoch
   */
  public generationTime!: number

  /** Returns the ObjectId id as a 24 character hex string representation */
  public toHexString (): string {
    if (ObjectId.cacheHexString && this.__id) {
      return this.__id
    }

    const hexString = bufferToString.call(this.id, 'hex')

    if (ObjectId.cacheHexString && !this.__id) {
      this.__id = hexString
    }

    return hexString
  }

  /**
   * Update the ObjectId index
   * @privateRemarks
   * Used in generating new ObjectId's on the driver
   * @internal
   */
  public static getInc (): number {
    return (ObjectId.index = (ObjectId.index + 1) % 0xffffff)
  }

  /**
   * Generate a 12 byte id buffer used in ObjectId's
   *
   * @param time - pass in a second based timestamp.
   */
  public static generate (time?: number): Uint8Array {
    if (typeof time !== 'number') {
      time = ~~(Date.now() / 1000)
    }

    const inc = ObjectId.getInc()
    const buffer = bufferAlloc(12)

    // 4-byte timestamp
    writeUInt32BE.call(buffer, time, 0)

    // 5-byte process unique
    buffer[4] = PROCESS_UNIQUE[0]
    buffer[5] = PROCESS_UNIQUE[1]
    buffer[6] = PROCESS_UNIQUE[2]
    buffer[7] = PROCESS_UNIQUE[3]
    buffer[8] = PROCESS_UNIQUE[4]

    // 3-byte counter
    buffer[11] = inc & 0xff
    buffer[10] = (inc >> 8) & 0xff
    buffer[9] = (inc >> 16) & 0xff

    return buffer as Uint8Array
  }

  /**
   * Converts the id into a 24 character hex string for printing
   *
   * @param format - The Buffer toString format parameter.
   * @internal
   */
  public toString (format?: 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex'): string {
    // Is the id a buffer then use the buffer toString method to return the format
    if (format) return bufferToString.call(this.id, format)
    return this.toHexString()
  }

  /**
   * Converts to its JSON the 24 character hex string representation.
   * @internal
   */
  public toJSON (): string {
    return this.toHexString()
  }

  /**
   * Compares the equality of this ObjectId with `otherID`.
   *
   * @param otherId - ObjectId instance to compare against.
   */
  public equals (otherId: string | ObjectId | ObjectIdLike): boolean {
    if (otherId === undefined || otherId === null) {
      return false
    }

    if (otherId instanceof ObjectId) {
      return this.toString() === otherId.toString()
    }

    if (
      typeof otherId === 'string' &&
      ObjectId.isValid(otherId) &&
      otherId.length === 12 &&
      isBufferOrArray(this.id)
    ) {
      return otherId === bufferToString.call(this.id, 'latin1')
    }

    if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 24) {
      return otherId.toLowerCase() === this.toHexString()
    }

    if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12) {
      return bufferEquals.call(bufferFrom(otherId), this.id)
    }

    if (
      typeof otherId === 'object' &&
      'toHexString' in otherId &&
      typeof otherId.toHexString === 'function'
    ) {
      return otherId.toHexString() === this.toHexString()
    }

    return false
  }

  /** Returns the generation date (accurate up to the second) that this ID was generated. */
  public getTimestamp (): Date {
    const timestamp = new Date()
    const time = readUInt32BE.call(this.id, 0)
    timestamp.setTime(Math.floor(time) * 1000)
    return timestamp
  }

  /** @internal */
  public static createPk (): ObjectId {
    return new ObjectId()
  }

  /**
   * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
   *
   * @param time - an integer number representing a number of seconds.
   */
  public static createFromTime (time: number): ObjectId {
    const buffer = bufferFrom([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    // Encode time into first 4 bytes
    writeUInt32BE.call(buffer, time, 0)
    // Return the new objectId
    return new ObjectId(buffer as Uint8Array)
  }

  /**
   * Creates an ObjectId from a hex string representation of an ObjectId.
   *
   * @param hexString - create a ObjectId from a passed in 24 character hexstring.
   */
  public static createFromHexString (hexString: string): ObjectId {
    // Throw an error if it's not a valid setup
    if (typeof hexString === 'undefined' || (hexString != null && hexString.length !== 24)) {
      throw new TypeError(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      )
    }

    return new ObjectId(bufferFromHex(hexString) as Uint8Array)
  }

  /**
   * Checks if a value is a valid bson ObjectId
   *
   * @param id - ObjectId instance to validate.
   */
  public static isValid (id: number | string | ObjectId | Uint8Array | ObjectIdLike): boolean {
    if (id == null) return false

    if (typeof id === 'number') {
      return true
    }

    if (typeof id === 'string') {
      return id.length === 12 || (id.length === 24 && checkForHexRegExp.test(id))
    }

    if (id instanceof ObjectId) {
      return true
    }

    if (isBufferOrArray(id) && id.length === 12) {
      return true
    }

    // Duck-Typing detection of ObjectId like objects
    if (typeof id === 'object' && 'toHexString' in id && typeof id.toHexString === 'function') {
      if (typeof id.id === 'string') {
        return id.id.length === 12
      }
      return id.toHexString().length === 24 && checkForHexRegExp.test(bufferToString.call(id.id, 'hex'))
    }

    return false
  }

  /** @internal */
  public toExtendedJSON (): ObjectIdExtended {
    if (this.toHexString) return { $oid: this.toHexString() }
    return { $oid: this.toString('hex') }
  }

  /** @internal */
  public static fromExtendedJSON (doc: ObjectIdExtended): ObjectId {
    return new ObjectId(doc.$oid)
  }

  /**
   * Converts to a string representation of this Id.
   *
   * @returns return the 24 character hex string representation.
   * @internal
   */
  public [Symbol.for('nodejs.util.inspect.custom')] (): string {
    return this.inspect()
  }

  public inspect (): string {
    return `new ObjectId("${this.toHexString()}")`
  }
}

try {
  Object.defineProperty(ObjectId.prototype, 'id', {
    configurable: true,
    enumerable: true,
    get (): Uint8Array {
      return this[kId]
    },
    set (value: Uint8Array) {
      this[kId] = value
      if (ObjectId.cacheHexString) {
        this.__id = bufferToString.call(value, 'hex')
      }
    }
  })
  Object.defineProperty(ObjectId.prototype, 'generationTime', {
    configurable: true,
    enumerable: true,
    get (): number {
      return readInt32BE.call(this.id, 0)
    },
    set (value: number) {
      // Encode time into first 4 bytes
      writeUInt32BE.call(this.id, value, 0)
    }
  })
} catch (_) {}

// Deprecated methods
defValue(ObjectId.prototype, 'generate', {
  value: deprecate(
    (time: number) => ObjectId.generate(time),
    'Please use the static `ObjectId.generate(time)` instead'
  )
})

defValue(ObjectId.prototype, 'getInc', {
  value: deprecate(() => ObjectId.getInc(), 'Please use the static `ObjectId.getInc()` instead')
})

defValue(ObjectId.prototype, 'get_inc', {
  value: deprecate(() => ObjectId.getInc(), 'Please use the static `ObjectId.getInc()` instead')
})

defValue(ObjectId, 'get_inc', {
  value: deprecate(() => ObjectId.getInc(), 'Please use the static `ObjectId.getInc()` instead')
})

defValue(ObjectId.prototype, '_bsontype', { value: 'ObjectID' })
