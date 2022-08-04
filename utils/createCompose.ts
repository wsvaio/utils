// middleware 执行器
export type middleware<ctx = any> = (ctx: ctx, next: () => Promise<any>) => Promise<any>;
export type plugins<ctx = any> = { useList: middleware<ctx>[], errorList: middleware<ctx & { error: Error; }>[], finalList: middleware<ctx & { error?: Error; }>[]; }[];
// 洋葱模型运行机制
export async function onion(ctx: any, ...middleware: middleware[]) {
  let index = -1;
  await (async function next() {
    if (++index >= middleware.length) return;
    const auto = middleware[index].length <= 1;
    await middleware[index](ctx, next);
    auto && await next();
  })();
}

export function createCompose<ctx = any>() {

  const useList: middleware<ctx>[] = [];
  const errorList: middleware<ctx & { error: Error; }>[] = [];
  const finalList: middleware<ctx & { error?: Error; }>[] = [];

  function plugin(...plugins: plugins<ctx>) {
    for (const item of plugins) {
      item.useList.forEach(fn => useList.push(fn));
      item.errorList.forEach(fn => errorList.push(fn));
      item.finalList.forEach(fn => finalList.push(fn));
    }
  }
  async function run(ctx: ctx) {
    try {
      await onion(ctx, ...useList);
    } catch (error) {
      Object.assign(ctx, { error });
      await onion(ctx, ...errorList);
    } finally {
      await onion(ctx, ...finalList);
    }
    return ctx;
  }

  return {
    useList, errorList, finalList,
    use: useList.push.bind(useList),
    error: errorList.push.bind(errorList),
    final: finalList.push.bind(finalList),
    plugin, run,
  };

}