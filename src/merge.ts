import { is } from "./is";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * 递归合并两个对象到obj1
 * deep: 递归深度
 * overwrite: 是否覆盖obj1已有的属性
 * del: 是否删除obj1中obj2不存在的属性
 * has：只有obj1中有的属性才赋值
 */
export const merge = <TObj1 extends object, TObj2 extends DeepPartial<TObj1> | object>(
  obj1: TObj1,
  obj2: TObj2,
  { deep = 1, overwrite = true, del = false, has = false } = {},
) => {
  deep--;
  if (del) {
    const dels = Object.keys(obj1).filter(item => !Object.keys(obj2).includes(item));
    for (const key of dels) delete obj1[key];
  }
  for (const [key, val] of Object.entries(obj2)) {
    if (has && [null, undefined].includes(obj1[key])) continue;
    if (is("Object", "Array")(val) && deep > 0 && Array.isArray(val) == Array.isArray(obj1[key])) {
      if (Array.isArray(val)) {
        Array.isArray(obj1[key]) ? (obj1[key].length = 0) : (obj1[key] = []);
        obj1[key].push(...val);
      }
      else {
        merge(obj1[key] || (obj1[key] = {}), val, { deep, overwrite, del, has });
      }
    }
    else {
      if (!overwrite && ![null, undefined].includes(obj1[key])) continue;
      obj1[key] = val;
    }
  }
  return obj1;
};

export const mergePlus = <Obj1 extends object | object[], Obj2 extends DeepPartial<Obj1> | object | object[]>(
  obj1: Obj1,
  obj2: Obj2,
  { deep = 1, overwrite = true, del = false, has = false } = {},
) => {
  deep--;
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    obj1.length = 0;
    obj1.push(...obj2.map((item) => {
      if (is("Array")(item))
        return mergePlus([], item, { deep, overwrite, del, has });
      else if (is("Object")(item))
        return mergePlus({}, item, { deep, overwrite, del, has });
      else return item;
    }));
  }
  else if (is("Object")(obj1) && is("Object")(obj2)) {
    if (del) {
      const dels = Object.keys(obj1).filter(item => !Object.keys(obj2).includes(item));
      for (const key of dels) delete obj1[key];
    }
    for (const [key, val] of Object.entries(obj2)) {
      if (has && [null, undefined].includes(obj1[key])) continue;
      if (is("Object", "Array")(val) && deep > 0 && Array.isArray(val) == Array.isArray(obj1[key])) {
        if (Array.isArray(val))
          mergePlus(obj1[key] || (obj1[key] = []), val, { deep, overwrite, del, has });
        else
          mergePlus(obj1[key] || (obj1[key] = {}), val, { deep, overwrite, del, has });
      }
      else {
        if (!overwrite && ![null, undefined].includes(obj1[key])) continue;
        obj1[key] = val;
      }
    }
  }
};
