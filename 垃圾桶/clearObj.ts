/**
 * clearObj(obj, val)
 * 将obj中所有可枚举属性复值为val
 */
 export default (obj: any, val: any) => {
  Object.keys(obj).forEach(key => obj[key] = val);
}