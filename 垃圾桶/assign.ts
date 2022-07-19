/**
 * assign(obj1, obj2, deep);
 * obj2的所有可枚举属性都会被赋值给obj1，obj1上如果有obj2上不存在的属性将被删除
 * deep为深度，默认一层
 */

export default function assign(obj1, obj2, deep = 1) {
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