import { is } from "./is";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * 合并两个对象并返回，在默认情况下与Object.assign类似
 * @param obj1 合并的对象，该对象的值会被修改，并作为返回值
 * @param obj2 合并的对象
 * @param options.deep 递归的深度，默认为1
 * @param options.overwrite 是否覆盖obj1已有的属性，默认为true
 * @param options.del 是否删除obj1中obj2不存在的属性，默认为false
 * @param options.has 是否只有obj1中有的属性才赋值，默认为false
 * @return obj1
 */
export const merge = <Obj1 extends object, Obj2 extends DeepPartial<Obj1> | object>(
  obj1: Obj1,
  obj2: Obj2,
  options = {} as { deep?: number; overwrite?: boolean; del?: boolean; has?: boolean },
) => {
  let { deep = 1, overwrite = true, del = false, has = false } = options;
  const handle = (key) => {
    if (is("Array", "Object")(obj2[key]) && deep > 0) {
      if (obj1[key] === undefined) obj1[key] = is("Array") ? [] : {};
      merge(obj1[key], obj2[key], { deep, overwrite, del, has });
    }
    else if (overwrite || obj1[key] === undefined) {
      obj1[key] = obj2[key];
    }
  };
  deep--;
  if (is("Array")(obj1) && is("Array")(obj2)) {
    if (del && obj1.length > obj2.length) obj1.length = obj2.length;
    for (let i = 0; i < (has ? obj1.length : obj2.length); i++) handle(i);
  }
  else if (is("Object")(obj1) && is("Object")(obj2)) {
    if (del) {
      const dels = Object.keys(obj1).filter(item => !Object.keys(obj2).includes(item));
      for (const key of dels) delete obj1[key];
    }
    for (const key of Object.keys(obj2)) {
      if (has && obj1[key] === undefined) continue;
      handle(key);
    }
  }
  else {
    Object.assign(obj1, obj2);
  }
  return obj1;
};
