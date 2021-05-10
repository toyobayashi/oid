/* eslint-disable */

declare var __webpack_public_path__: any
declare var __non_webpack_require__: any

function tryGetRequireFunction (): NodeRequire | undefined {
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

  return nativeRequire
}

export const _require = tryGetRequireFunction()
