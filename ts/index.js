'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/oid.cjs.min.js')
} else {
  module.exports = require('./dist/oid.cjs.js')
}
