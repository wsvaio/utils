import type { DeepKeys, DeepOmit } from "./types";

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
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[], del = false) {
  const result = <{ [P in Exclude<keyof T, K>]: T[P] }>{};
  for (const key of Object.keys(obj).filter(key => !keys.includes(key as K))) {
    result[key] = obj[key];
    del && delete obj[key];
  }
  // @ts-expect-error pass
  return result as DeepOmit<T, K>;
}

/**
 * 从对象中深度选择指定的属性
 * @param obj - 要选择属性的对象
 * @param keys - 要选择的属性的键
 * @returns 一个新的对象，包含指定的属性
 * @template T - 对象的类型
 * @template K - 属性的键的类型
 */
export function deepOmit<T extends object, K extends DeepKeys<T>>(obj: T, ...keys: K[]) {
  keys = [...new Set(keys)];

  const then: Record<string, string[]> = {};
  const result = {} as any;

  for (const key of Object.keys(obj).filter(item => !keys.filter(sub => !sub.includes(".")).includes(item as K)))
    obj[key] === undefined || (result[key] = obj[key]);

  for (const key of keys.filter(item => item.includes("."))) {
    const keys = key.split(".");
    if (!then[keys[0]])
      then[keys[0]] = [];
    then[keys[0]].push(keys.slice(1).join("."));
  }

  for (const [k, v] of Object.entries(then)) {
    if (!obj[k])
      continue;

    result[k] = deepOmit(obj[k], ...v);
  }

  return result as DeepOmit<T, K>;
}
