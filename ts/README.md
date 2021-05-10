# oid-lite

Use MongoDB ObjectID without installing bson.

## Usage

``` bash
$ npm install @tybys/oid-lite
```

### Browser

``` html
<script src="https://cdn.jsdelivr.net/npm/@tybys/oid-lite/dist/oid.min.js"></script>

<script>
console.log(new oid.ObjectId().toHexString());
</script>
```

`Symbol` & `TypedArray` polyfill is required by legacy browsers. Use [@tybys/oid](https://www.npmjs.com/package/@tybys/oid) for full support.

``` html
<script src="https://cdn.jsdelivr.net/npm/@tybys/oid/dist/oid.min.js"></script>

<script>
console.log(new oid.ObjectId().toHexString());
</script>
```

### Node.js

``` js
const { ObjectId } = require('@tybys/oid-lite')
console.log(new ObjectId())
```

### TypeScript

``` ts
import { ObjectId } from '@tybys/oid-lite'
console.log(new ObjectId())
```

## API

Same as [mongodb/js-bson/src/objectid.ts](https://github.com/mongodb/js-bson/blob/master/src/objectid.ts).

[API Documentation](https://github.com/toyobayashi/oid/blob/master/ts/docs/api/index.md)
