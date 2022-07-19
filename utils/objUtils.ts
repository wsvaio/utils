/**
 * assign(obj1, obj2, deep);
 * obj2的所有可枚举属性都会被赋值给obj1，obj1上如果有obj2上不存在的属性将被删除
 * deep为深度，默认一层
 */

 export function assign(obj1, obj2, deep = 1) {
  deep--;
  const { keys, entries, defineProperty, getOwnPropertyDescriptor, setPrototypeOf, getPrototypeOf } = Object;
  const obj2Keys = keys(obj2);
  const dels = keys(obj1).filter(item => !obj2Keys.includes(item));
  setPrototypeOf(obj1, getPrototypeOf(obj2));
  for (let [key, val] of entries(obj2)) {
    if (!(val instanceof Object) || deep <= 0 || !(obj1[key] ?? false)) defineProperty(obj1, key, getOwnPropertyDescriptor(obj2, key) ?? {});
    if (val instanceof Object && deep > 0) assign(obj1[key] = {}, val, deep);
  }
  for (let key of dels) delete obj1[key];
  return obj1;
}

/**
 * clearObj(obj, val)
 * 将obj中所有可枚举属性复值为val
 */
 export function clearObj(obj, val) {
  Object.keys(obj).forEach(key => obj[key] = val);
}

/**
 * 合并两个对象
 * overwrite = false obj1已有的属性值会被保留
 * overwrite = true obj1的属性值总会被obj2覆写
 * 
 */
 export function merge(obj1, obj2, deep = 1, overwrite = false) {
  deep--;
  const { keys, entries, defineProperty, getOwnPropertyDescriptor, setPrototypeOf, getPrototypeOf } = Object;
  setPrototypeOf(obj1, getPrototypeOf(obj2));
  for (let [key, val] of entries(obj2)) {
    if (!(obj1[key] instanceof Object) && !overwrite && obj1[key] != undefined && obj1[key] != null) continue;
    if (!(val instanceof Object) || deep <= 0) defineProperty(obj1, key, getOwnPropertyDescriptor(obj2, key) ?? {});
    obj1[key] ?? (obj1[key] = {});
    if (val instanceof Object && deep > 0) merge(obj1[key], val, deep);
  }
  return obj1;
}
