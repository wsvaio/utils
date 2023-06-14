import { sleep } from "./sleep";

/**
 * 一个重试错误的函数，如果出现错误会在一定时间内重试多次。
 *
 * @param handle 要重试的操作。
 * @param options 一个可选的对象，包含重试次数和重试之间的延迟时间。
 * @param options.count 重试操作的次数。默认为 3。
 * @param options.time 重试之间的延迟时间（以毫秒为单位）。默认为 3000。
 *
 * @returns 一个 Promise，当操作成功时会被解析，当达到最大重试次数时会被拒绝。
 */
export const errorRetry = async (
	handle: () => Promise<any>,
	options = {} as { count?: number; time?: number },
) => {
	const { count = 3, time = 3000 } = options;
	await sleep(time);
	await handle().catch(error => {
		if (count <= 1)
			return Promise.reject(error);
		else
			return errorRetry(handle, { count: count - 1, time });
	});
};
