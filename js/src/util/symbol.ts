let _Symbol: SymbolConstructor

if (typeof Symbol === 'function') {
  _Symbol = Symbol
} else {
  _Symbol = function (id: string) {
    return `Symbol(${id})`
  } as any
  _Symbol.for = function (id: string): any {
    return `Symbol(${id})`
  }
}

export { _Symbol as Symbol }
