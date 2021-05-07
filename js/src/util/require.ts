/* eslint-disable */

declare var __webpack_public_path__: any
declare var __non_webpack_require__: any

export function tryGetRequireFunction (parentModule?: NodeJS.Module): NodeRequire | undefined {
  let nativeRequire

  if (typeof __webpack_public_path__ !== 'undefined') {
    nativeRequire = (function () {
      return typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : undefined
    })()
  } else {
    nativeRequire = (function () {
      return typeof __webpack_public_path__ !== 'undefined' ? (typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : undefined) : (typeof require !== 'undefined' ? require : undefined)
    })()
  }

  if (typeof nativeRequire === 'function') {
    const g = (function (defaultValue) {
      let g
      g = (function (this: any) { return this })() // non-strict mode

      try {
        g = g || new Function('return this')() // allow eval
      } catch (_) {
        if (typeof globalThis !== 'undefined') return globalThis
        if (typeof __webpack_public_path__ === 'undefined') {
          if (typeof global !== 'undefined') return global
        }
        if (typeof window !== 'undefined') return window
        if (typeof self !== 'undefined') return self
      }

      return g || defaultValue
    })()
    if (!(g && g.process && g.process.versions && typeof g.process.versions.node === 'string')) {
      return nativeRequire
    }

    if (nativeRequire === g.require) {
      return nativeRequire
    }

    let Module: null | typeof import('module')
    try {
      Module = nativeRequire('module')
    } catch (_) {
      return nativeRequire
    }

    Module = typeof Module === 'function' ? Module : ((typeof Module === 'object' && Module !== null) ? (Module as typeof import('module')).Module : null)
    if (!Module || !(parentModule instanceof Module)) {
      return nativeRequire
    }

    return (function makeRequireFunction (mod: NodeJS.Module, main: NodeJS.Module | undefined) {
      const Module = mod.constructor as typeof import('module')
      function require (path: string) {
        return mod.require(path)
      };

      function validateString (value: any, name: string) {
        if (typeof value !== 'string') throw new TypeError('The "' + name + '" argument must be of type string. Received type ' + typeof value)
      }

      function resolve (request: string, opts: any) {
        validateString(request, 'request')
        return (Module as any)._resolveFilename(request, mod, false, opts)
      }

      require.resolve = resolve

      function paths (request: string) {
        validateString(request, 'request')
        return (Module as any)._resolveLookupPaths(request, mod)
      }

      resolve.paths = paths

      require.main = main
      require.extensions = (Module as any)._extensions
      require.cache = (Module as any)._cache

      return require
    })(parentModule, (g.process.mainModule instanceof Module) ? g.process.mainModule : undefined)
  }

  return nativeRequire
}
