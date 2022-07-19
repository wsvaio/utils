/**
 * 防抖
 * 事件函数一段时间后才执行，如果在这段事件内再次调用，则重新计算执行时间
 * immediately 是否立刻执行
 */
export function debounce (fn: Function, time = 1000, immediately = false) {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer == null && immediately) fn(...args);
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, time);
  }

}

/**
 * 节流
 * 每隔一段时间，只执行一次
 * immediately 是否立刻执行
 */
 export function throttle(fn: Function, time = 1000, immediately = false) {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer != null) return;
    if (immediately) fn(...args);
    timer = setTimeout(() => { timer = null; if (!immediately) fn(...args); }, time);
  }
}
