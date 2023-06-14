// 取函数参数类型
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
/**
 * 防抖函数。
 * 在一段时间内，如果函数被调用多次，则只执行最后一次调用。
 *
 * @param fn 要防抖的函数。
 * @param time 防抖时间，单位为毫秒。默认为 1000。
 * @returns 返回一个新的函数，该函数在防抖时间内只执行最后一次调用。
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, time = 1000) => {
	let timer = null;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(fn, time, ...args);
	};
};

/**
 * 节流函数。
 * 在一段时间内，如果函数被调用多次，则只执行一次。
 *
 * @param fn 要节流的函数。
 * @param time 节流时间，单位为毫秒。默认为 1000。
 * @returns 返回一个新的函数，该函数在节流时间内只执行一次调用。
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, time = 1000) => {
	let timer = null;
	return (...args: Parameters<T>) => {
		if (timer != null) return;
		timer = setTimeout(() => (timer = null), time);
		fn(...args);
	};
};
