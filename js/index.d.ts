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
