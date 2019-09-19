# oid

Use MongoDB ObjectID without installing bson.

## Usage

``` bash
$ npm install @toyo/oid
```

### Browser

``` html
<script src="node_modules/@toyo/oid/dist/oid.min.js"></script>

<script>
var oid = new ObjectId();
console.log(oid);
</script>
```

### Node.js

``` js
const ObjectId = require('@toyo/oid')
const oid = new ObjectId()
console.log(oid)
```

### TypeScript

``` ts
import * as ObjectId from '@toyo/oid'
const oid = new ObjectId()
console.log(oid)
```

## API

Same as [mongodb/js-bson/lib/objectid.js](https://github.com/mongodb/js-bson/blob/master/lib/objectid.js).

See [`index.d.ts`](https://github.com/toyobayashi/oid/blob/master/index.d.ts).