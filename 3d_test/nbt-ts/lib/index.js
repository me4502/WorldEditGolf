"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("./tag");
__export(require("./tag"));
__export(require("./snbt"));
/** Doubles the size of the buffer until the required amount is reached. */
function accommodate(buffer, offset, size) {
    while (buffer.length < offset + size) {
        buffer = Buffer.concat([buffer, Buffer.alloc(buffer.length)]);
    }
    return buffer;
}
/**
 * Decodes a nbt tag
 *
 * @param hasName Expect nbt tag to have a name. For example, Minecraft uses unnamed
 * tags in slots in its network protocol.
 * @param offset Start decoding at this offset in the buffer
*/
function decode(buffer, hasName, offset = 0, useMaps = false) {
    if (hasName == null)
        hasName = true;
    const tagType = buffer.readUInt8(offset);
    offset += 1;
    let name = null;
    if (hasName) {
        const len = buffer.readUInt16BE(offset);
        offset += 2;
        name = buffer.toString("utf-8", offset, offset += len);
    }
    if (tagType == tag_1.TagType.End)
        return { name, value: null, offset };
    return { name, ...decodeTagValue(tagType, buffer, offset, useMaps) };
}
exports.decode = decode;
/** Encodes a nbt tag. If the name is `null` the nbt tag will be unnamed. */
function encode(name = "", tag) {
    let buffer = Buffer.alloc(1024), offset = 0;
    // write tag type
    offset = buffer.writeUInt8(tag == null ? tag_1.TagType.End : tag_1.getTagType(tag), offset);
    // write tag name
    if (name != null)
        ({ buffer, offset } = writeString(name, buffer, offset));
    // write tag value
    if (tag != null)
        ({ buffer, offset } = encodeTagValue(tag, buffer, offset));
    return buffer.slice(0, offset);
}
exports.encode = encode;
/** Encodes a string with it's length prefixed as unsigned 16 bit integer */
function writeString(text, buffer, offset) {
    const data = Buffer.from(text);
    buffer = accommodate(buffer, offset, data.length + 2);
    offset = buffer.writeUInt16BE(data.length, offset);
    data.copy(buffer, offset), offset += data.length;
    return { buffer, offset };
}
function decodeTagValue(type, buffer, offset, useMaps) {
    let value;
    switch (type) {
        case tag_1.TagType.Byte:
            value = new tag_1.Byte(buffer.readInt8((offset += 1) - 1));
            break;
        case tag_1.TagType.Short:
            value = new tag_1.Short(buffer.readInt16BE((offset += 2) - 2));
            break;
        case tag_1.TagType.Int:
            value = new tag_1.Int(buffer.readInt32BE((offset += 4) - 4));
            break;
        case tag_1.TagType.Long:
            value = buffer.readBigInt64BE((offset += 8) - 8);
            break;
        case tag_1.TagType.Float:
            value = new tag_1.Float(buffer.readFloatBE((offset += 4) - 4));
            break;
        case tag_1.TagType.Double:
            value = buffer.readDoubleBE((offset += 8) - 8);
            break;
        case tag_1.TagType.ByteArray: {
            const len = buffer.readUInt32BE(offset);
            offset += 4;
            value = buffer.slice(offset, offset += len);
            break;
        }
        case tag_1.TagType.String: {
            const len = buffer.readUInt16BE(offset);
            value = (offset += 2, buffer.toString("utf-8", offset, offset += len));
            break;
        }
        case tag_1.TagType.List: {
            const type = buffer.readUInt8(offset);
            const len = buffer.readUInt32BE(offset + 1);
            offset += 5;
            const items = [];
            for (let i = 0; i < len; i++) {
                ({ value, offset } = decodeTagValue(type, buffer, offset, useMaps));
                items.push(value);
            }
            value = items;
            break;
        }
        case tag_1.TagType.Compound: {
            const object = useMaps ? new Map : {};
            while (true) {
                const type = buffer.readUInt8(offset);
                offset += 1;
                if (type == tag_1.TagType.End)
                    break;
                const len = buffer.readUInt16BE(offset);
                offset += 2;
                const name = buffer.toString("utf-8", offset, offset += len);
                ({ value, offset } = decodeTagValue(type, buffer, offset, useMaps));
                if (useMaps)
                    object.set(name, value);
                else
                    object[name] = value;
            }
            value = object;
            break;
        }
        case tag_1.TagType.IntArray: {
            const length = buffer.readUInt32BE(offset);
            offset += 4;
            const array = value = new Int32Array(length);
            for (let i = 0; i < length; i++) {
                array[i] = buffer.readInt32BE(offset + i * 4);
            }
            offset += array.buffer.byteLength;
            break;
        }
        case tag_1.TagType.LongArray: {
            const length = buffer.readUInt32BE(offset);
            offset += 4;
            const array = value = new BigInt64Array(length);
            for (let i = 0; i < length; i++) {
                array[i] = buffer.readBigInt64BE(offset + i * 8);
            }
            offset += array.buffer.byteLength;
            break;
        }
        default: throw new Error(`Tag type ${type} not implemented`);
    }
    return { value: value, offset };
}
exports.decodeTagValue = decodeTagValue;
function encodeTagValue(tag, buffer, offset) {
    // since most of the data types are smaller than 8 bytes, allocate this amount
    buffer = accommodate(buffer, offset, 8);
    if (tag instanceof tag_1.Byte) {
        offset = tag.value < 0
            ? buffer.writeInt8(tag.value, offset)
            : buffer.writeUInt8(tag.value, offset);
    }
    else if (tag instanceof tag_1.Short) {
        offset = tag.value < 0
            ? buffer.writeInt16BE(tag.value, offset)
            : buffer.writeUInt16BE(tag.value, offset);
    }
    else if (tag instanceof tag_1.Int) {
        offset = tag.value < 0
            ? buffer.writeInt32BE(tag.value, offset)
            : buffer.writeUInt32BE(tag.value, offset);
    }
    else if (typeof tag == "bigint") {
        offset = tag < 0
            ? buffer.writeBigInt64BE(tag, offset)
            : buffer.writeBigUInt64BE(tag, offset);
    }
    else if (tag instanceof tag_1.Float) {
        offset = buffer.writeFloatBE(tag.value, offset);
    }
    else if (typeof tag == "number") {
        offset = buffer.writeDoubleBE(tag, offset);
    }
    else if (tag instanceof Buffer || tag instanceof Int8Array) {
        offset = buffer.writeUInt32BE(tag.length, offset);
        buffer = accommodate(buffer, offset, tag.length);
        (tag instanceof Buffer ? tag : Buffer.from(tag)).copy(buffer, offset);
        offset += tag.length;
    }
    else if (tag instanceof Array) {
        const type = tag.length > 0 ? tag_1.getTagType(tag[0]) : tag_1.TagType.End;
        offset = buffer.writeUInt8(type, offset);
        offset = buffer.writeUInt32BE(tag.length, offset);
        for (const item of tag) {
            if (tag_1.getTagType(item) != type)
                throw new Error("Odd tag type in list");
            ({ buffer, offset } = encodeTagValue(item, buffer, offset));
        }
    }
    else if (typeof tag == "string") {
        ({ buffer, offset } = writeString(tag, buffer, offset));
    }
    else if (tag instanceof Int32Array) {
        offset = buffer.writeUInt32BE(tag.length, offset);
        buffer = accommodate(buffer, offset, tag.byteLength);
        for (let i = 0; i < tag.length; i++) {
            buffer.writeInt32BE(tag[i], offset + i * 4);
        }
        offset += tag.byteLength;
    }
    else if (tag instanceof BigInt64Array) {
        offset = buffer.writeUInt32BE(tag.length, offset);
        buffer = accommodate(buffer, offset, tag.byteLength);
        for (let i = 0; i < tag.length; i++) {
            buffer.writeBigInt64BE(tag[i], offset + i * 8);
        }
        offset += tag.byteLength;
    }
    else {
        for (const [key, value] of tag instanceof Map ? tag : Object.entries(tag)) {
            offset = buffer.writeUInt8(tag_1.getTagType(value), offset);
            ({ buffer, offset } = writeString(key, buffer, offset));
            ({ buffer, offset } = encodeTagValue(value, buffer, offset));
        }
        buffer = accommodate(buffer, offset, 1);
        offset = buffer.writeUInt8(0, offset);
    }
    return { buffer, offset };
}
exports.encodeTagValue = encodeTagValue;
