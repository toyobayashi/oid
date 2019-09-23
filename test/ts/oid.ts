import * as ObjectId from '../../index';

// ----------------------------------------------------------------------------
// setup test data
const time: number = 1414093117;
const array: number[] = [84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144];
const buffer: Buffer = Buffer.from([84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144]);
const hexString: string = "54495ad94c934721ede76d90";
const idString: string = "TIZÙLG!íçm";

// ----------------------------------------------------------------------------
// should construct with no arguments
let oid = new ObjectId();

// ----------------------------------------------------------------------------
// should have an `id` property
oid.id;

// ----------------------------------------------------------------------------
// should construct with a `time` argument
oid = new ObjectId(time);

// ----------------------------------------------------------------------------
// should construct with an `array` argument
oid = new ObjectId(array);

// ----------------------------------------------------------------------------
// should construct with a `buffer` argument
oid = new ObjectId(buffer);

// ----------------------------------------------------------------------------
// should construct with a `hexString` argument
oid = new ObjectId(hexString);

// ----------------------------------------------------------------------------
// should construct with a `idString` argument
oid = new ObjectId(idString);

// ----------------------------------------------------------------------------
// should construct with `ObjectID.createFromTime(time)` and should have 0's at the end
oid = ObjectId.createFromTime(time);

// ----------------------------------------------------------------------------
// should construct with `ObjectID.createFromHexString(hexString)`
oid = ObjectId.createFromHexString(hexString);

// ----------------------------------------------------------------------------
// should correctly retrieve timestamp
const timestamp: Date = oid.getTimestamp();

// ----------------------------------------------------------------------------
// should validate valid hex strings
let isValid: boolean = ObjectId.isValid(hexString);

// ----------------------------------------------------------------------------
// should validate legit ObjectID objects
isValid = ObjectId.isValid(oid);

// ----------------------------------------------------------------------------
// should invalidate bad strings
// not necessary for typescript

// ----------------------------------------------------------------------------
// should evaluate equality with .equals()
const id1 = new ObjectId();
const id2 = new ObjectId(id1);
const equals: boolean = id1.equals(id2);

// ----------------------------------------------------------------------------
// should evaluate equality with via deepEqual
// not necessary for typescript

// ----------------------------------------------------------------------------
// should generate valid hex strings
const str1: number[] | Uint8Array = ObjectId.generate();
const str2: number[] | Uint8Array = ObjectId.generate(time);

// ----------------------------------------------------------------------------
// should convert to a hex string for JSON.stringify
// not necessary for typescript

// ----------------------------------------------------------------------------
// should convert to a hex string for ObjectID.toString()
const toStr: string = oid.toString();

// ----------------------------------------------------------------------------
// should throw and error if constructing with an invalid string
// not necessary for typescript
