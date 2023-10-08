/**
 * 返回一个新对象，该对象只包含原对象中指定的属性。如果  del  参数为  true ，则还会从原对象中删除指定的属性。
 * @param obj - 要挑选属性的对象。
 * @param keys - 要挑选的属性名列表。
 * @param del - 是否从原对象中删除挑选出的属性，默认为 `false`。
 * @returns 挑选出的属性组成的新对象。
 *
 * @typeParam T - 要挑选属性的对象类型。
 * @typeParam K - 要挑选的属性名类型，必须是 `T` 中的键名。
 * @typeParam R - 挑选出的属性组成的新对象类型。
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[], del = false) => {
	const result = <{ [P in K]: T[P] }>{};
	for (const key of keys) {
		result[key] = obj[key];
		del && delete obj[key];
	}
	return result;
};
