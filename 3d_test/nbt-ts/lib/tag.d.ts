/// <reference types="node" />
export declare enum TagType {
    End = 0,
    Byte = 1,
    Short = 2,
    Int = 3,
    Long = 4,
    Float = 5,
    Double = 6,
    ByteArray = 7,
    String = 8,
    List = 9,
    Compound = 10,
    IntArray = 11,
    LongArray = 12
}
export declare class Byte {
    value: number;
    constructor(value: number);
    valueOf(): number;
}
export declare class Short {
    value: number;
    constructor(value: number);
    valueOf(): number;
}
export declare class Int {
    value: number;
    constructor(value: number);
    valueOf(): number;
}
export declare class Float {
    value: number;
    constructor(value: number);
    valueOf(): number;
}
export interface TagArray extends Array<Tag> {
}
export interface TagObject {
    [key: string]: Tag;
}
export interface TagMap extends Map<string, Tag> {
}
export declare type Tag = number | string | bigint | Byte | Short | Int | Float | Buffer | Int8Array | Int32Array | BigInt64Array | TagArray | TagObject | TagMap;
export declare function getTagType(tag: Tag): TagType;
