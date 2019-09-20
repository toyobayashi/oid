declare class ObjectId {
  constructor ();
  constructor (id: number);
  constructor (id: string);
  constructor (id: number[]);
  constructor (id: Uint8Array);
  constructor (id: ObjectId);

  static createFromTime (time: number): ObjectId;
  static createFromHexString (hexString: string): ObjectId;

  static isValid (otherId: number): boolean;
  static isValid (otherId: string): boolean;
  static isValid (otherId: number[]): boolean;
  static isValid (otherId: Uint8Array): boolean;
  static isValid (otherId: ObjectId): boolean;

  static createPk (): ObjectId;

  static generate (): Uint8Array;
  static generate (time: any): Uint8Array;

  static getInc(): number;
  static fromExtendedJSON(doc: ObjectId.Document): ObjectId;
  static index: number;

  readonly id: string | Uint8Array;

  toHexString(): string;

  equals(otherId: string): boolean;
  equals(otherId: Uint8Array): boolean;
  equals(otherId: ObjectId): boolean;

  getTimestamp(): Date;

  toString(): string;
  toString(format: string): string;

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
