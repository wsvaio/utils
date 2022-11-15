export const remove = <T extends Object>(obj: T, ...keys: (keyof T)[]) => {
  const result = <{ [k in keyof T]: T[k] }>{};
  for (const key of keys) {
    result[key] = obj[key];
    delete obj[key];
  }
  return result;
};
