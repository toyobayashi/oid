module.exports = {
  entry: 'index.js',
  output: 'dist',
  outputName: 'oid',
  library: 'oid',
  format: 'umd',
  terserOptions: {
    ie8: true,
    output: {
      comments: false
    }
  },
  replaceESModule: true
}
