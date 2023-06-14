/**
 * 将一个 Promise 对象转换为一个包含错误和数据的元组。
 *
 * @typeparam T Promise 对象返回的数据类型。
 * @param fn 要转换的 Promise 对象。
 * @returns 一个元组，包含错误和数据。
 */
export const to = <T>(fn: Promise<T>) =>
	fn.then(data => <[null, T]>[null, data]).catch(err => <[Error, null]>[err, null]);

/**
 * 获取一个值的类型字符串。
 *
 * @param value 要获取类型的值。
 * @returns 值的类型字符串。
 */
export const toTypeString = (value: unknown) => Object.prototype.toString.call(value);

/**
 * 获取一个值的原始类型字符串。
 *
 * @param value 要获取类型的值。
 * @returns 值的原始类型字符串。
 */
export const toRawType = (value: unknown) => toTypeString(value).slice(8, -1);
