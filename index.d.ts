declare class ObjectId {
  constructor (id?: number | string | number[] | Uint8Array | ObjectId);

  static createFromTime (time: number): ObjectId;
  static createFromHexString (hexString: string): ObjectId;

  static isValid (otherId: number | string | number[] | Uint8Array | ObjectId): boolean;

  static createPk (): ObjectId;

  static generate (time?: number): Uint8Array;

  static getInc(): number;
  static fromExtendedJSON(doc: ObjectId.Document): ObjectId;
  static index: number;

  readonly id: string | Uint8Array;

  toHexString(): string;

  equals(otherId: string | Uint8Array | ObjectId): boolean;

  getTimestamp(): Date;

  toString(format?: string): string;

  toJSON(): string;
  toExtendedJSON(): ObjectId.EmptyDocument;

  generationTime: number;

  readonly _bsontype: 'ObjectID';
}

declare namespace ObjectId {
  export interface EmptyDocument {
    $oid: string;
  }

  export interface Document extends EmptyDocument {
    [field: string]: any;
  }
}

export = ObjectId;
