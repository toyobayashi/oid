declare class ObjectId {
  constructor (id?: null | number | string | number[] | Uint8Array | ObjectId);
  static createFromTime (time: number): ObjectId;
  static createFromHexString (hexString: string): ObjectId;
  static isValid (other: null | number | string | number[] | Uint8Array | ObjectId): boolean;
  static createPk (): ObjectId;
  static generate (time?: null | number): string;
  static getInc(): number;
  static fromExtendedJSON(doc: ObjectId.Document): ObjectId;
  static index: number

  readonly id: string | Uint8Array;

  toHexString(): string;
  equals(other: string | Uint8Array | ObjectId): boolean;
  getTimestamp(): Date;
  toString(): string;
  toJSON(): string;
  inspect(): string;
  toExtendedJSON(): { $oid: string };

  generationTime: number

  readonly _bsontype: 'ObjectID'
}

declare namespace ObjectId {
  export interface Document {
    $oid: string;
    [field: string]: any;
  }
}

export = ObjectId
