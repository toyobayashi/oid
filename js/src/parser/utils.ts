import { bufferAlloc } from '../util/buffer'
import { tryGetRequireFunction } from '../util/require'

const _require = tryGetRequireFunction()

type RandomBytesFunction = (size: number) => Uint8Array

const isReactNative = typeof navigator === 'object' && navigator.product === 'ReactNative'

const insecureWarning = isReactNative
  ? 'BSON: For React Native please polyfill crypto.getRandomValues, e.g. using: https://www.npmjs.com/package/react-native-get-random-values.'
  : 'BSON: No cryptographic implementation for random bytes present, falling back to a less secure implementation.'

const insecureRandomBytes: RandomBytesFunction = function insecureRandomBytes (size: number) {
  if (typeof console !== 'undefined') console.warn(insecureWarning)

  const result = bufferAlloc(size)
  for (let i = 0; i < size; ++i) result[i] = Math.floor(Math.random() * 256)
  return result as Uint8Array
}

const detectRandomBytes = (): RandomBytesFunction => {
  if (typeof window !== 'undefined') {
    // browser crypto implementation(s)
    const target: Crypto = window.crypto || (window as any).msCrypto // allow for IE11
    if (target?.getRandomValues) {
      return size => target.getRandomValues(new Uint8Array(size))
    }
  }

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // allow for RN packages such as https://www.npmjs.com/package/react-native-get-random-values to populate global
    return size => crypto.getRandomValues(new Uint8Array(size))
  }

  let requiredRandomBytes: RandomBytesFunction | null | undefined
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    requiredRandomBytes = _require!('crypto').randomBytes
  } catch (e) {
    // keep the fallback
  }

  // NOTE: in transpiled cases the above require might return null/undefined

  return requiredRandomBytes ?? insecureRandomBytes
}

export const randomBytes = detectRandomBytes()

export function isAnyArrayBuffer (value: unknown): value is ArrayBuffer {
  return ['[object ArrayBuffer]', '[object SharedArrayBuffer]'].indexOf(
    Object.prototype.toString.call(value)
  ) !== -1
}

export function deprecate<T extends Function> (fn: T, message: string): T {
  if (typeof _require === 'function') {
    return _require('util').deprecate(fn, message)
  }
  let warned = false
  function deprecated (this: unknown, ...args: unknown[]): any {
    if (!warned) {
      if (typeof console !== 'undefined') console.warn(message)
      warned = true
    }
    return fn.apply(this, args)
  }
  return (deprecated as unknown) as T
}
