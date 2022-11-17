export const remove = <T extends Object, K extends keyof T>(obj: T, ...keys: K[]) => {
  const result = <{ [key in K]: T[key] }>{};
  for (const key of keys) {
    result[key] = obj[key];
    delete obj[key];
  }
  return result;
};
