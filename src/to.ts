export const to = <T>(fn: Promise<T>) => fn.then(data => (<[null, T]>[null, data])).catch(err => (<[Error, null]>[err, null]));

export const toTypeString = (value: unknown) => Object.prototype.toString.call(value);

export const toRawType = (value: unknown) => toTypeString(value).slice(8, -1);