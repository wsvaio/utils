export const omit = <T extends Object, K extends keyof T>(obj: T, ...keys: K[]) => {
  const result = <{ [key in K]: T[key] }>{};
  for (const key of <K[]>Object.keys(obj)) {
    if (keys.includes(key)) continue;
    result[key] = obj[key];
  }
  return result;
};