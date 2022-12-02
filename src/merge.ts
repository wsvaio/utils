/**
 * 递归合并两个对象到obj1
 * deep: 递归深度
 * overwrite: 是否覆盖obj1已有的属性
 * del: 是否删除obj1中obj2不存在的属性
 * has：只有obj1中有的属性才赋值
 */

import { isSimpleObject } from "./toString";

// 递归可选
export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> } | Record<any, any>
  : T;

export const merge = <
  TObj1 extends object,
  TObj2 extends DeepPartial<TObj1> = DeepPartial<TObj1>,
>(
  obj1: TObj1,
  obj2: TObj2,
  {
    deep = 1,
    overwrite = true,
    del = false,
    has = false,
  } = {}
) => {
  deep--;
  if (del) {
    const dels = Object.keys(obj1).filter(item => !Object.keys(obj2).includes(item));
    for (const key of dels) delete obj1[key];
  }
  for (const [key, val] of Object.entries(obj2)) {
    if (has && [null, undefined].includes(obj1[key])) continue;
    if (isSimpleObject(val) && deep > 0 && Array.isArray(val) == Array.isArray(obj1[key])) {
      Array.isArray(val)
        ? !Array.isArray(obj1[key]) && (obj1[key] = [])
        : !isSimpleObject(obj1[key]) && (obj1[key] = {});
      merge(obj1[key], val, { deep, overwrite, del });
    } else {
      if (!overwrite && ![null, undefined].includes(obj1[key])) continue;
      obj1[key] = val;
    }
  }

  return obj1;
}








