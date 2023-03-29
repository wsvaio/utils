export type Middleware<Context> = (ctx: Context, next: () => Promise<void>) => Promise<any>;
export interface Compose<Context> {
  (...initials: Middleware<Context>[]): Compose<Context>;
  (context: Context): Promise<Context>;
  set: Set<Middleware<Context>>;
  use: (...middlewares: Middleware<Context>[]) => Compose<Context>;
  unuse: (...middlewares: Middleware<Context>[]) => Compose<Context>;
  run: (ctx: Context) => Promise<Context>;
}

export const compose = <Context extends object = {}>(
  ...initials: Middleware<Context>[]
): Compose<Context> => {
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
      if (!fn) return;
      await fn(ctx, next);
      fn.length <= 1 && (await next());
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
};
