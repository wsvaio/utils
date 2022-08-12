export default <T>(obj: T, ...keys: (keyof T)[]) => {
  const result = <{[k in keyof T]: T[k]}>{};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;

};