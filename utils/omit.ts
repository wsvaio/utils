
export default <T>(obj: T, ...keys: (keyof T)[]) => {
  const result = <{[k in keyof T]: T[k]}>{};
  for (const key of <(keyof T)[]>Object.keys(obj)) {
    if (keys.includes(key)) continue;
    result[key] = obj[key];
  }
  return result;
};