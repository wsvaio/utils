/**
 * @typeparam Context 上下文类型。
 */
export type Middleware<Context> = (ctx: Context, next: () => Promise<any>) => any | Promise<any>;

/**
 * 中间件函数组合接口。
 *
 * @typeparam Context 上下文类型。
 */
export interface Compose<Context> {
  /**
   * 构造一个新的中间件函数组合。
   *
   * @param initials 初始中间件函数列表。
   * @returns 构造出的中间件函数组合。
   */
  (...initials: Middleware<Context>[]): Compose<Context>;

  /**
   * 执行中间件函数组合。
   *
   * @param context 上下文对象。
   * @returns 执行后的上下文对象。
   */
  (context: Context): Promise<Context>;

  /**
   * 中间件函数集合。
   */
  set: Set<Middleware<Context>>;

  /**
   * 添加中间件函数到中间件函数集合中。
   *
   * @param middlewares 要添加的中间件函数列表。
   * @returns 当前的中间件函数组合。
   */
  use: (...middlewares: Middleware<Context>[]) => Compose<Context>;

  /**
   * 从中间件函数集合中删除指定的中间件函数。
   *
   * @param middlewares 要删除的中间件函数列表。
   * @returns 当前的中间件函数组合。
   */
  unuse: (...middlewares: Middleware<Context>[]) => Compose<Context>;

  /**
   * 执行中间件函数组合。
   *
   * @param ctx 上下文对象。
   * @returns 执行后的上下文对象。
   */
  run: (ctx: Context) => Promise<Context>;
}

/**
 * 构造一个中间件函数组合。
 *
 * @typeparam Context 上下文类型。
 * @param initials 初始中间件函数列表。
 * @returns 构造出的中间件函数组合。
 */
export function compose<Context extends object = {}>(...initials: Middleware<Context>[]): Compose<Context> {
  const set = new Set<Middleware<Context>>(initials);

  const use = (...middlewares: Middleware<Context>[]) => {
    middlewares.forEach(middleware => set.add(middleware));
    return result;
  };

  const unuse = (...middlewares: Middleware<Context>[]) => {
    middlewares.forEach(middleware => set.delete(middleware));
    return result;
  };

  const run = async (ctx: Context) => {
    let i = -1;

    const list = [...set];
    const next = async () => {
      const fn = list[++i];
      if (!fn)
        return;
      const result = await fn(ctx, next);
      return (fn.length <= 1 && (await next())) || result;
    };
    await next();
    return ctx;
  };
  function result(...middlewares: Middleware<Context>[]): Compose<Context>;
  function result(context: Context): Promise<Context>;
  function result(context: Middleware<Context> | Context, ...middlewares: Middleware<Context>[]) {
    return typeof context == "function" ? use(context, ...middlewares) : run(context);
  }
  result.set = set;
  result.use = use;
  result.unuse = unuse;
  result.run = run;
  return result;
}
