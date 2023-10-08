/**
 * 返回一个新对象，该对象不包含原对象中指定的属性。如果  del  参数为  true ，则还会从原对象中删除指定的属性。
 * @param obj - 要删除属性的对象。
 * @param keys - 要删除的属性名列表。
 * @param del - 是否从原对象中删除指定的属性，默认为 `false`。
 * @returns 删除指定属性后的新对象。
 *
 * @typeParam T - 要删除属性的对象类型。
 * @typeParam K - 要删除的属性名类型，必须是 `T` 中的键名。
 * @typeParam R - 删除指定属性后的新对象类型。
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[], del = false) => {
	const result = <{ [P in Exclude<keyof T, K>]: T[P] }>{};
	for (const key of Object.keys(obj).filter(key => !keys.includes(key as K))) {
		result[key] = obj[key];
		del && delete obj[key];
	}
	return result;
};
