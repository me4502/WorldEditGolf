"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TagType;
(function (TagType) {
    TagType[TagType["End"] = 0] = "End";
    TagType[TagType["Byte"] = 1] = "Byte";
    TagType[TagType["Short"] = 2] = "Short";
    TagType[TagType["Int"] = 3] = "Int";
    TagType[TagType["Long"] = 4] = "Long";
    TagType[TagType["Float"] = 5] = "Float";
    TagType[TagType["Double"] = 6] = "Double";
    TagType[TagType["ByteArray"] = 7] = "ByteArray";
    TagType[TagType["String"] = 8] = "String";
    TagType[TagType["List"] = 9] = "List";
    TagType[TagType["Compound"] = 10] = "Compound";
    TagType[TagType["IntArray"] = 11] = "IntArray";
    TagType[TagType["LongArray"] = 12] = "LongArray";
})(TagType = exports.TagType || (exports.TagType = {}));
class Byte {
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Byte = Byte;
class Short {
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Short = Short;
class Int {
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Int = Int;
class Float {
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Float = Float;
function getTagType(tag) {
    if (tag instanceof Byte)
        return TagType.Byte;
    if (tag instanceof Short)
        return TagType.Short;
    if (tag instanceof Int)
        return TagType.Int;
    if (typeof tag == "bigint")
        return TagType.Long;
    if (tag instanceof Float)
        return TagType.Float;
    if (typeof tag == "number")
        return TagType.Double;
    if (tag instanceof Buffer || tag instanceof Int8Array)
        return TagType.ByteArray;
    if (typeof tag == "string")
        return TagType.String;
    if (tag instanceof Array)
        return TagType.List;
    if (tag.constructor == Object || tag instanceof Map)
        return TagType.Compound;
    if (tag instanceof Int32Array)
        return TagType.IntArray;
    if (tag instanceof BigInt64Array)
        return TagType.LongArray;
    throw new Error("Invalid tag value");
}
exports.getTagType = getTagType;
