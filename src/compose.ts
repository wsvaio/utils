// 定义中间件函数类型，接收上下文对象和 next 方法作为参数，返回 Promise<any>
export type Middleware<Context> = (ctx: Context, next: () => Promise<void>) => Promise<any>;
// 定义 Compose 接口，它包含了一些常用的方法
export interface Compose<Context> {
  // 支持可变参数，返回一个 Compose 对象
  (...initials: Middleware<Context>[]): Compose<Context>;
  // 接收一个上下文对象，并返回一个 Promise
  (context: Context): Promise<Context>;
  // 存储注册的中间件
  set: Set<Middleware<Context>>;
  // 添加一个或多个中间件到执行链的队列中
  use: (...middlewares: Middleware<Context>[]) => Compose<Context>;
  // 从队列中删除一个或多个中间件
  unuse: (...middlewares: Middleware<Context>[]) => Compose<Context>;
  // 执行中间件链，并返回上下文对象
  run: (ctx: Context) => Promise<Context>;
}
// 定义 compose 函数，返回一个 Compose 对象，接收任意数量的中间件作为参数
export const compose = <Context extends object = {}>(
  ...initials: Middleware<Context>[]
): Compose<Context> => {
  // 创建 Set 实例用于存储注册的中间件
  const set = new Set<Middleware<Context>>(initials);
  // 添加一个或多个中间件到执行链的队列中
  const use = (...middlewares: Middleware<Context>[]) => {
    middlewares.forEach(middleware => set.add(middleware));
    return result; // 返回 Compose 对象，支持链式调用
  };
  // 从队列中删除一个或多个中间件
  const unuse = (...middlewares: Middleware<Context>[]) => {
    middlewares.forEach(middleware => set.delete(middleware));
    return result; // 返回 Compose 对象，支持链式调用
  };
  // 执行中间件链，并返回上下文对象
  const run = async (ctx: Context) => {
    let i = -1;
    // 将中间件 Set 转换为数组
    const list = [...set];
    const next = async () => {
      const fn = list[++i];
      if (!fn) return; // 中间件执行完毕，退出递归
      await fn(ctx, next); // 执行中间件，并传入 next 方法
      // 如果中间件未调用 next 方法，则递归执行下一个中间件
      fn.length <= 1 && (await next());
    };
    await next();
    return ctx; // 返回执行完中间件链的上下文对象
  };
  // 定义 result 函数，用于支持可变参数
  function result(...middlewares: Middleware<Context>[]): Compose<Context>;
  function result(context: Context): Promise<Context>;
  // result 函数根据参数类型，决定是添加中间件还是执行中间件链
  function result(context: Middleware<Context> | Context, ...middlewares: Middleware<Context>[]) {
    return typeof context == "function" ? use(context, ...middlewares) : run(context);
  }
  // 将 set、use、unuse 和 run 挂载到 result 对象上，用于支持链式调用
  result.set = set;
  result.use = use;
  result.unuse = unuse;
  result.run = run;
  return result; // 返回 Compose 对象
};
