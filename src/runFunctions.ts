/**
 * 使用同一组参数运行多个函数。
 * @param funs 要运行的函数数组。
 * @returns 一个函数，该函数接受参数并使用相同的参数运行所有函数。
 */
export function runFunctions(...funs: Function[]) {
  return (...args: any[]) =>
    funs.forEach(fun => fun(...args));
}
