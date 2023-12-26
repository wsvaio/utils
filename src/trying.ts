/**
 * @typeparam T 执行函数的返回值类型。
 * @param fn 要执行的函数。
 * @returns 函数执行的结果。
 */
export const trying = async <T>(fn: () => T) => await fn();

/**
 * 同步执行一个函数，如果函数执行出错则捕获异常并执行 catch 回调函数。
 *
 * @typeparam T 执行函数的返回值类型。
 * @param tryCallBack 要执行的函数。
 * @param catchCallBack 函数执行出错时的回调函数。
 * @param finallyCallBack 函数执行完毕后的回调函数。
 * @returns 函数执行的结果。
 */
export function tryingSync<T>(tryCallBack: () => T,	catchCallBack?: (error: unknown) => any,	finallyCallBack?: () => any) {
  try {
    return tryCallBack();
  }
  catch (error) {
    catchCallBack && catchCallBack(error);
  }
  finally {
    finallyCallBack && finallyCallBack();
  }
}
