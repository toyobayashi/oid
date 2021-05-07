module.exports = {
  // output: {
  //   doc: false
  // },
  bundleOnly: ['umd', 'cjs', { type: 'esm-bundler', minify: false }, 'esm-browser'],
  bundleDefine: {
    __VERSION__: JSON.stringify(require('./package.json').version)
  }
}
