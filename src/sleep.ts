/**
 * 一个实用函数，返回一个 Promise，在指定时间后解决。
 *
 * @param timeout 等待时间，以毫秒为单位。
 * @returns 在指定时间后解决的 Promise。
 */
export const sleep = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));
