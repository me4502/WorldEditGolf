/// <reference types="node" />
import { Tag } from "./tag";
export * from "./tag";
export * from "./snbt";
interface DecodeResult {
    name: string | null;
    value: Tag | null;
    offset: number;
}
/**
 * Decodes a nbt tag
 *
 * @param hasName Expect nbt tag to have a name. For example, Minecraft uses unnamed
 * tags in slots in its network protocol.
 * @param offset Start decoding at this offset in the buffer
*/
export declare function decode(buffer: Buffer, hasName?: boolean | null, offset?: number, useMaps?: boolean): DecodeResult;
/** Encodes a nbt tag. If the name is `null` the nbt tag will be unnamed. */
export declare function encode(name: string | null | undefined, tag: Tag | null): Buffer;
export declare function decodeTagValue(type: number, buffer: Buffer, offset: number, useMaps: boolean): {
    value: Tag;
    offset: number;
};
export declare function encodeTagValue(tag: Tag, buffer: Buffer, offset: number): {
    buffer: Buffer;
    offset: number;
};
