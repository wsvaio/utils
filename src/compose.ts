export type Middleware<Context> = (ctx: Context, next: () => Promise<void>) => Promise<unknown>;
export interface Compose<Context> {
  (...middlewares: Middleware<Context>[]): Compose<Context>;
  (context: Context): Promise<void>;
  middlewares: Middleware<Context>[];
  use: (...handlers: Middleware<Context>[]) => Compose<Context>;
  run: (ctx: Context) => Promise<void>;
}

export const compose = <Context extends object = {}>(
  ...middlewares: Middleware<Context>[]
): Compose<Context> => {
  const use = (...handlers: Middleware<Context>[]) => {
    middlewares.push(...handlers);
    return result;
  };

  const run = (ctx: Context) => {
    let i = -1;
    const next = async () => {
      if (!middlewares[++i]) return;
      await middlewares[i](ctx, next);
      middlewares[i].length <= 1 && (await next());
    };
    return next();
  };

  function result(...middlewares: Middleware<Context>[]): Compose<Context>;
  function result(context: Context): Promise<void>;
  function result(arg: Middleware<Context> | Context, ...middlewares: Middleware<Context>[]) {
    if (typeof arg == "function") {
      use(arg, ...middlewares);
      return result;
    }
    else { return run(arg); }
  }

  result.middlewares = middlewares;
  result.use = use;
  result.run = run;

  return result;
};
