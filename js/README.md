# oid-js

Use MongoDB ObjectID without installing bson.

* `dist/oid.js`: 20KB
* `dist/oid.min.js`: 8KB

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

Same as [mongodb/js-bson/lib/objectid.js](https://github.com/mongodb/js-bson/blob/master/lib/objectid.js).

See [`index.d.ts`](https://github.com/toyobayashi/oid/blob/master/index.d.ts).

``` ts
export declare interface EmptyDocument {
  $oid: string;
}

export declare interface Document extends EmptyDocument {
  [field: string]: any;
}

export declare class ObjectId {
  constructor(id?: number | string | number[] | Uint8Array | ObjectId);

  static createFromTime(time: number): ObjectId;

  static createFromHexString(hexString: string): ObjectId;

  static isValid(otherId: number | string | number[] | Uint8Array | ObjectId): boolean;

  static createPk(): ObjectId;

  static generate(time?: number): number[] | Uint8Array;

  static getInc(): number;

  static fromExtendedJSON(doc: Document): ObjectId;

  static index: number;

  readonly id: string | number[] | Uint8Array;

  readonly _bsontype: 'ObjectID';

  generationTime: number;

  toHexString(): string;

  equals(otherId: string | number[] | Uint8Array | ObjectId): boolean;

  getTimestamp(): Date;

  toString(format?: string): string;

  toJSON(): string;

  toExtendedJSON(): EmptyDocument;
}
```
