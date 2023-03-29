export type Middleware<Context> = (ctx: Context, next: () => Promise<void>) => Promise<any>;
export interface Compose<Context> {
  (...middlewares: Middleware<Context>[]): Compose<Context>;
  (context: Context): Promise<Context>;
  set: Set<Middleware<Context>>;
  use: (...handlers: Middleware<Context>[]) => Compose<Context>;
  run: (ctx: Context) => Promise<Context>;
}

export const compose = <Context extends object = {}>(
  ...middlewares: Middleware<Context>[]
): Compose<Context> => {
  const set = new Set<Middleware<Context>>();
  const use = (...middlewares: Middleware<Context>[]) => {
    middlewares.forEach(set.add);
    return result;
  };

  const run = async (ctx: Context) => {
    let i = -1;
    const middlewares = [...set];
    const next = async () => {
      if (!middlewares[++i]) return;
      await middlewares[i](ctx, next);
      middlewares[i].length <= 1 && (await next());
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
  result.run = run;
  result(...middlewares);
  return result;
};
