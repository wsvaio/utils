export const toString = (obj: unknown) => Object.prototype.toString.call(obj);

export const isSimpleObject = (obj: unknown) => ["[object Object]", "[object Array]"].includes(toString(obj));
