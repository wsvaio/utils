type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
/**
 * 防抖
 * 事件函数一段时间后才执行，如果在这段事件内再次调用，则重新计算执行时间
 */
 export function debounce<T extends (...args: any[]) => any>(fn: T, time = 1000) {
  let timer: any = null;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(fn, time, ...args);
  }

}


/**
 * 节流
 * 每隔一段时间，只执行一次
 */
 export function throttle<T extends (...args: any[]) => any>(fn: T, time = 1000) {
  let timer: any = null;
  return (...args: Parameters<T>) => {
    if (timer != null) return;
    timer = setTimeout(() => { timer = null; }, time);
    fn(...args);
  }
}