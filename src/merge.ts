/**
 * 递归合并两个对象到obj1
 * deep: 递归深度
 * overwrite: 是否覆盖obj1已有的属性
 * del: 是否删除obj1中obj2不存在的属性
 * rtn: 是否返回obj1
 * has：只有obj1中有的属性才赋值
 */

import { isSimpleObject } from "./toString";

// 递归可选
type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> } | Record<any, any>
  : T;

export const merge = <
  TObj1 extends object,
  TObj2 extends DeepPartial<TObj1> = DeepPartial<TObj1>,
  TOverwrite extends boolean = true,
  TDel extends boolean = false,
  TRtn extends boolean = true,
  THas extends boolean = false,
>(
  obj1: TObj1,
  obj2: TObj2,
  {
    deep = 1,
    overwrite = <TOverwrite>true,
    del = <TDel>false,
    rtn = <TRtn>true,
    has = <THas>false
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
        : typeof obj1[key] != "object" && (obj1[key] = {});
      merge(obj1[key], val, { deep, overwrite, del, rtn });
    } else {
      if (!overwrite && ![null, undefined].includes(obj1[key])) continue;
      obj1[key] = val;
    }
  }

  // obj2排除obj1
  type TObj2ExculdeTObj1 = {
    [K in Exclude<keyof TObj2, keyof TObj1>]: TObj2[K]
  }
  // obj1排除obj2
  type TObj1ExculdeTObj2 = {
    [K in Exclude<keyof TObj1, keyof TObj2>]: TObj1[K]
  }

  type TOverwriteRtnType = TOverwrite extends true
    ? { [K in keyof TObj2]: TObj2[K] } & TObj1ExculdeTObj2
    : { [K in keyof TObj1]: TObj1[K] } & TObj2ExculdeTObj1;

  type TDelRtnType = TDel extends true
    ? { [K in Exclude<keyof TOverwriteRtnType, keyof TObj1ExculdeTObj2>]: TOverwriteRtnType[K] }
    : TOverwriteRtnType;

  type THasRtnType = THas extends true
    ? { [K in Exclude<keyof TDelRtnType, keyof TObj2ExculdeTObj1>]: TDelRtnType[K] }
    : TDelRtnType;

  type rtnType = TRtn extends true
    ? THasRtnType
    : "";

  return <rtnType>(rtn ? obj1 : "");
}








