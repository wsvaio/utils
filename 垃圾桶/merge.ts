/**
 * 合并两个对象
 * overwrite = false obj1已有的属性值会被保留
 * overwrite = true obj1的属性值总会被obj2覆写
 * 
 */
export default function merge(obj1, obj2, deep = 1, overwrite = false) {
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
