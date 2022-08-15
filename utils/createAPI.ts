import merge from "./merge";
import { dateFormat } from "./formats";
import { createCompose, middleware, plugins } from "./createCompose";
import toString from "./toString";
import trying from "./trying";


// 总环境类型 custom: 自定义属性 params: body query param 的类型
export type ctx<custom = {}, params = {}> = {
  log?: boolean, // 是否控制台打印日志
  timeout?: number, // 超时中断的时间
  url?: string, // 请求地址
  baseURL?: string, // 根地址
  body?: Partial<params> & { [k: string]: any; } | string | FormData | Blob | ArrayBuffer, // 请求体
  query?: Partial<params> & { [k: string]: any; }, // 请求search参数
  param?: Partial<params> & { [k: string]: any; }, // 请求参数
  error?: Partial<Error & ctx<custom, params>>, // 错误
  data?: any, // 响应结果
  message?: string, // 响应消息
  status?: number, // 状态码
  response?: Response, // 响应
} & Omit<RequestInit, "body"> & custom; // RequestInit fetch配置 custom 自定义配置



// 发送请求，核心中间件
const middle = async ctx => ctx.response = await fetch((ctx.baseURL ?? "") + ctx.url, <object>ctx);

export function createAPI<custom = {}>(_ctx = <ctx<custom>>{}, ...plugins: plugins<ctx<custom>>) {

  const { error, final, run, useList, errorList, finalList, plugin } = createCompose<ctx<custom>>();

  if (plugins.length != 0) plugin(...plugins);
  else {
    // 合并全局与局部配置
    useList.push(async ctx => merge(ctx, _ctx, { deep: Infinity, overwrite: false, del: false }));
    // 超时中断请求
    useList.push(async ctx => {
      if (!ctx.timeout) return;
      const controller = new AbortController();
      ctx.signal = controller.signal;
      setTimeout(() => controller.abort(), ctx.timeout);
    });
    // 初始化headers
    useList.push(async ctx => ctx.headers ??= {});

    // 拼接请求url
    useList.push(async ctx => {
      const { query, param={} } = ctx;
      const url = new URL(ctx.url ?? "", "http://localhost");
      if (query) for (const [k, v] of Object.entries(query)) {
        if (Array.isArray(v)) {
          for (const item of v) {
            url.searchParams.append(k, item);
          }
        } else url.searchParams.append(k, v);
      }

      const body: any = toString(ctx.body) == "[object Object]" ? ctx.body : {};
      const keys = url.pathname.split("/").filter(item => item.startsWith(":")).map(item => item.substring(1));
      for (const key of keys) {
        url.pathname = url.pathname.replace(`:${key}`, param[key] ?? body[key]);
      }
      ctx.url = url.pathname + url.search + url.hash;
    });

    // 添加Content-Type（因为要转换为JSON，fetch默认对字符串设置为text/plain）
    useList.push(async ctx => {
      if (!["[object Object]", "[object Array]"].includes(toString(ctx.body))) return;
      await trying(() => {
        ctx.body = JSON.stringify(ctx.body);
        ctx.headers!["Content-Type"] = "application/json;charset=UTF-8";
      }).catch(() => {});
    });

    // ************************************* 发送请求（核心中间件，命名为 middle， 所有前置都在此之前，后置都在此之后）*************************************
    useList.push(middle);


    useList.push(async ctx => {
      if (!["[object String]"].includes(toString(ctx.body))) return;
      ctx.body = await trying(() => JSON.parse(<string>ctx.body)).catch(() => ctx.body);
    });

    // 格式化结果
    useList.push(async ctx => {
      const text = await ctx.response!.text();
      const data = await trying(() => JSON.parse(text)).catch(() => text);
      Object.assign(ctx, { data, status: ctx.response!.status });
      ctx.message = `请求${ctx.response!.ok ? '成功' : '失败'}：${ctx.response!.status} ${ctx.response!.statusText}`;
    });
    // 抛出错误状态码
    useList.push(async ctx => ctx?.response?.ok || Promise.reject(ctx));



    // 错误处理
    error(async (ctx, next) => {
      // AbortError AbortController触发 请求超时
      ctx.message = ctx.error.message;
      ctx?.error?.name == "AbortError" ? (ctx.message = `请求超时：${ctx.timeout}`) : ctx.message = ctx?.error?.message;
      await next();
      // 总会抛出错误
      return Promise.reject(ctx);
    });


    // 打印日志
    final(async ctx => {
      if (!ctx.log) return;
      ctx.response ??= <Response>{ ok: false, status: 400, statusText: "Bad Request" };
      ctx.body ??= {};
      ctx.data ??= { message: ctx.message };
      const data = (typeof ctx.data  != "object" || Array.isArray(ctx.data)) ? { data: ctx.data } : ctx.data;
      Object.setPrototypeOf(data, new function result() { });
      Object.setPrototypeOf(ctx.body, new function params() { });
      Object.setPrototypeOf(ctx, new function context() { });
      console.groupCollapsed(`%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${ctx.response.status} ${ctx.response.statusText} `,
        "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
        "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
        "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
        `font-size: 16px; font-weight: 100; color: white; background: ${ctx.response.ok ? '#67C23A' : '#F56C6C'}; border-radius: 0 3px 3px 0;`,
      );
      console.log(ctx.body);
      console.log(data);
      console.log(ctx);
      console.groupEnd();
    });

  }



  // 泛型 params：body param query的可能包含的参数，data：请求响应的类型

  function fn(method = "get") {
    return <params = any, data = any>(options = <ctx<Partial<custom>, params> | string>{}) => {
      typeof options == "string" ? options = <ctx<custom>>{ url: options, method } : options.method = method;
      return async (ctx = <ctx<Partial<custom>, params>>{}): Promise<data> => {
        Object.assign(ctx, options);
        return (await run(<ctx<custom>>ctx)).data;
      };
    };
  }



  return {

    extendAPI: <T = {}>(ctx = <ctx<Partial<custom> & T>>{}) => createAPI<custom & T>(merge<any>(ctx, _ctx, { deep: Infinity, overwrite: false, del: false }), { useList, errorList, finalList }),

    error, final,
    before: (...middleware: middleware<ctx<custom>>[]) => {
      const index = useList.indexOf(middle);
      useList.splice(index, 0, ...middleware);
    },
    after: (...middleware: middleware<ctx<custom>>[]) => useList.push(...middleware),

    get: fn(),
    post: fn("post"),
    put: fn("put"),
    patch: fn("patch"),
    del: fn("delete"),

    head: fn("head"),
    connect: fn("connect"),
    options: fn("options"),
    trace: fn("trace"),

    request: fn(),
  };


}