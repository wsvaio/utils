import { sleep } from "./sleep";

export const errorRetry = async (
  handle: () => Promise<any>,
  options = {} as { count?: number; time?: number },
) => {
  const { count = 3, time = 3000 } = options;
  await sleep(time);
  await handle().catch((error) => {
    if (count <= 1)
      return Promise.reject(error);
    else
      return errorRetry(handle, { count: count - 1, time });
  });
};
