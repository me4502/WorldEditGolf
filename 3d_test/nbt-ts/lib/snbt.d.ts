/// <reference types="node" />
import * as nbt from ".";
export interface StringifyOptions {
    pretty?: boolean;
    breakLength?: number;
    quote?: "single" | "double";
}
export declare function stringify(tag: nbt.Tag, options?: StringifyOptions): string;
export declare function parse(text: string): string | number | bigint | Int32Array | BigInt64Array | nbt.Byte | nbt.Short | nbt.Int | nbt.Float | nbt.TagArray | Buffer | nbt.TagObject;
