const ObjectId = require('../index.js')

// const a = []
const max = 100000000
console.time('aaa')
for (let i = 0; i < max; i++) {
  const a = new ObjectId()
  if (i === 0 || i === max - 1) {
    console.log(a)
    console.log(a.generationTime)
  }
}
console.timeEnd('aaa')
