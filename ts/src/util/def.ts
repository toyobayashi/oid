// eslint-disable-next-line spaced-comment
const supportDefineProperty: boolean = /*#__PURE__*/ (function () {
  try {
    Object.defineProperty({}, 'a', { value: 0 })
    return true
  } catch (_) {
    return false
  }
})()

export { supportDefineProperty }

// eslint-disable-next-line spaced-comment
export const defValue: (obj: any, key: string, desc: { value: any }) => any = /*#__PURE__*/ (function () {
  return supportDefineProperty
    ? function (obj: any, key: string, desc: { value: any }): any {
      return Object.defineProperty(obj, key, desc)
    }
    : function (obj: any, key: string, desc: { value: any }): any {
      obj[key] = desc.value
      return obj
    }
})()
