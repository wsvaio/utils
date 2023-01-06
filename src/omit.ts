export const omit = <T extends Object, K extends keyof T>(obj: T, keys: K[], del = false) => {
  const result = <{ [P in Exclude<keyof T, K>]: T[P] }>{};
  for (const key of Object.keys(obj)) {
    if (keys.includes(<K>key)) continue;
    result[key] = obj[key];
    del && delete obj[key];
  }
  return result;
};
