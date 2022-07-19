// middleware 执行器
export type middleware<ctx = any> = (ctx: ctx, next: () => Promise<void>) => void;

export class MDW<ctx = any> {

  list: (middleware)[] = [];
  #catch: (middleware)[] = [];
  #finally: (middleware)[] = [];

  async #run(ctx: any, middleware: middleware[]) {
    let index = -1;
    await (async function run() {
      index++;
      if (index == middleware.length) return;
      await middleware[index](ctx, run);
    })();
  }



  use<T = ctx>(...middleware: middleware<T>[]) {
    this.list.push(...middleware);
  }
  error<T = ctx>(...middleware: middleware<T & { error: Error }>[]) {
    this.#catch.push(...middleware);
  }
  final<T = ctx>(...middleware: middleware<T & { error?: Error }>[]) {
    this.#finally.push(...middleware);
  }

  async run<T = ctx>(ctx: T) {
    try {
      await this.#run(ctx, this.list);
    } catch (error) {
      Object.assign(ctx, { error });
      await this.#run(ctx, this.#catch);
    } finally {
      await this.#run(ctx, this.#finally);
    }
  }
  
}

export function createMDW<ctx = any>() {

  const obj = new MDW<ctx>();
  const { use, error, final, run, list } = obj;

  return {
    list,
    use: use.bind(obj),
    error: error.bind(obj),
    final: final.bind(obj),
    run: run.bind(obj),
  }

}

