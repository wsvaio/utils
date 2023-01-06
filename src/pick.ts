export const pick = <T extends Object, K extends keyof T>(obj: T, keys: K[], del = false) => {
  const result = <{ [P in K]: T[P] }>{};
  for (const key of keys) {
    result[key] = obj[key];
    del && delete obj[key];
  }
  return result;
};
