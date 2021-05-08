# oid-js

Use MongoDB ObjectID without installing bson.

## Usage

``` bash
$ npm install @tybys/oid
```

### CLI

```
$ oid -h
Usage: oid [options]

Options:
  -v, -V, --version   output the version number
  -h, --help          output usage information
  -n, --number <N>    output N number of ObjectIds

Repo: https://github.com/toyobayashi/oid
```

### Browser

IE OK!

``` html
<script src="https://cdn.jsdelivr.net/npm/@tybys/oid/dist/oid.min.js"></script>

<script>
console.log(new oid.ObjectId().toHexString());
</script>
```

### Node.js

``` js
const { ObjectId } = require('@tybys/oid')
console.log(new ObjectId())
```

### TypeScript

``` ts
import { ObjectId } from '@tybys/oid'
console.log(new ObjectId())
```

## API

Same as [mongodb/js-bson/src/objectid.ts](https://github.com/mongodb/js-bson/blob/master/src/objectid.ts).

[API Documentation](https://github.com/toyobayashi/oid/blob/master/js/docs/api/index.md)
