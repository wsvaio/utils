export const runFunctions =
  (...funs: Function[]) =>
  (...args: any[]) =>
    funs.forEach(fun => fun(...args));