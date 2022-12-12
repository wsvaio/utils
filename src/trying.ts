export const trying = async <T>(fn: () => T) => await fn();

export const tryingSync = <T>(
  tryCallBack: () => T,
  catchCallBack?: (error: unknown) => any,
  finallyCallBack?: () => any
) => {
  try {
    return tryCallBack();
  } catch (error) {
    catchCallBack && catchCallBack(error);
  } finally {
    finallyCallBack && finallyCallBack();
  }
};
