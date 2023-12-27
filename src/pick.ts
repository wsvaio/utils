import type { DeepKeys, DeepPick } from "./types";

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
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[], del = false) {
  const result = <{ [P in K]: T[P] }>{};
  for (const key of keys) {
    result[key] = obj[key];
    del && delete obj[key];
  }
  // @ts-expect-error pass
  return result as DeepPick<T, K>;
}

/**
 * 从对象中深度选择指定的属性
 * @param obj - 要选择属性的对象
 * @param keys - 要选择的属性的键
 * @returns 一个新的对象，包含指定的属性
 * @template T - 对象的类型
 * @template K - 属性的键的类型
 */
export function deepPick<T extends object, K extends DeepKeys<T>>(obj: T, ...keys: K[]): DeepPick<T, K> {
  keys = [...new Set(keys)];
  const then: Record<string, string[]> = {};
  const result = (Array.isArray(obj) ? [] : {}) as any;
  for (const key of keys) {
    if (!key.includes(".")) {
      // @ts-expect-error pass
      obj[key] === undefined || (result[key] = obj[key]);
    }
    else {
      const index = key.indexOf(".");
      const k = key.slice(0, index);
      const v = key.slice(index + 1);
      then[k] ? then[k].push(v) : (then[k] = [v]);
    }
  }
  for (const [k, v] of Object.entries(then)) {
    if (!obj[k])
      continue;
    result[k] = deepPick(obj[k], ...v);
  }
  return result;
}
