/**
 * 防抖
 * 事件函数一段时间后才执行，如果在这段事件内再次调用，则重新计算执行时间
 */
export function debounce (fn: () => any, time = 1000) {
  let timer: any = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, time);
  }

}




/**
 * 节流
 * 每隔一段时间，只执行一次
 */
 export function throttle(fn: () => any, time = 1000) {
  let timer: any = null;
  return () => {
    if (timer != null) return;
    timer = setTimeout(() => { timer = null; }, time);
    fn();
  }
}


