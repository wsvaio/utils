export const pick = <T extends Object, K extends keyof T>(obj: T, keys: K[], del=false) => {
  const result = <{ [key in K]: T[key] }>{};
  for (const key of keys) {
    result[key] = obj[key];
    del && delete obj[key];
  }
  return result;

};