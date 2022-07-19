import dateFormat from "../utils/dateFormat";
import merge from "../utils/merge";

// 总环境类型 T 自定义类型配置
export type ctx<T = any, params = any> = {
  data?: any, // 响应结果
  message?: string, // 响应消息
  status?: number, // 状态码
  log?: boolean, // 是否控制台打印日志
  timeout?: number, // 超时中断的时间
  error?: Partial<Error & ctx>, // 错误
  url?: string, // 请求地址
  baseURL?: string, // 根地址
  body?: params, // 请求体
  query?: params, // 请求search参数
  param?: params, // 请求参数
  response?: Response, // 响应
} & Omit<RequestInit, "body"> & Partial<T>; // fetch配置 自定义配置

// 中间件
type fn<T = any> = (ctx: ctx<T>) => void;

class API <T = any> {
  // 全局环境（全局配置）
  ctx: ctx<T> = {};
  // 中间件列表
  middlewareList: fn<T>[] = [];
  // 错误中间件列表
  errorList: fn<T>[] = [];
  // 最终中间件列表
  finalList: fn<T>[] = [];
  
  constructor(ctx?: ctx<T>) {
    this.ctx = ctx ?? {};

    // 合并局部与全局环境配置
    this.middlewareList.push(ctx => merge(ctx, this.ctx, Infinity, true));
    // 中断控制器
    this.middlewareList.push(API.abort);
    // 添加Content-Type（fetch默认对字符串设置为text/plain）
    this.middlewareList.push(ctx => (ctx.headers || (ctx.headers = {})) && (ctx.body instanceof Object && (ctx.headers["Content-Type"] = "application/json")));
    // 删除get或head的请求体（这些方法不允许设置请求体）否则格式化请求体为json
    this.middlewareList.push(ctx => ["get", "head"].includes((ctx.method ?? "").toLowerCase()) ? delete ctx.body : Object.assign(ctx, { body: stringify(ctx.body) }));
    
    // 添加核心中间件
    this.middlewareList.push(API.core);

    // 恢复请求体的格式为对象
    this.middlewareList.push(ctx => ["get", "head"].includes((ctx.method ?? "").toLowerCase()) || (ctx.body = parse(ctx.body)));
    // 拦截响应码错误
    this.middlewareList.push(ctx => ctx?.response?.ok || Promise.reject(ctx));
    // 拦截请求超时错误
    this.errorList.push(ctx => ctx?.error?.name == "AbortError" && (ctx.message = `请求超时：${ctx.timeout}`));
    // 日志打印
    this.finalList.push(API.log);

  }
  // 添加前置中间件（添加至核心中间件之前）
  before(middleware: fn<T>) {
    const index = this.middlewareList.indexOf(API.core);
    this.middlewareList.splice(index, 0 , middleware);
  }
  // 添加后置中间件（添加至核心中间件之后）
  after(middleware: fn<T>) {
    this.middlewareList.push(middleware);
  }
  // 添加错误中间件
  error(middleware: fn<T>) {
    this.errorList.push(middleware);
  }
  // 添加最终中间件
  final(middleware: fn<T>) {
    this.finalList.push(middleware);
  }
  // 运行所有中间件（入口）
  async request<result = any>(ctx = <ctx<T>>{}) {
    try {
      for (const fn of this.middlewareList) await fn.call(this, ctx);
      return <result>ctx.data;
    } catch (error: any) {
      Object.assign(ctx, { error, message: error.message });
      for (const fn of this.errorList) await fn(ctx);
      return Promise.reject(ctx);
    } finally {
      for (const fn of this.finalList) await fn(ctx);
    }
  }

  // 核心中间件 请求在此发出
  static async core(ctx: ctx) {
    const { query, param } = ctx;
    // 拼接请求url
    const url = new URL(ctx.url ?? "", ctx.baseURL);
    if (query) for (let [k, v] of Object.entries<any>(query)) url.searchParams.append(k, v);
    if (param) for (let [k, v] of Object.entries<any>(param)) url.pathname = url.pathname.replace(`:${k}`, v);;
    ctx.url = url.pathname + url.search + url.hash;
    // 发送请求
    ctx.response = await fetch(url.href, ctx);
    // 格式化结果
    let data = await ctx.response.text();
    try { data = JSON.parse(data) } catch (error) {};
    Object.assign(ctx, { data, status: ctx.response.status });
    ctx.message || (ctx.message = `请求${ctx.response.ok ? '成功' : '失败'}：${ctx.response.status} ${ctx.response.statusText}`);
  }
  // 中断控制器 // 超时中断请求
  static abort(ctx: ctx) {
    if (!ctx.timeout) return;
    const controller = new AbortController();
    ctx.signal = controller.signal;
    setTimeout(() => controller.abort(), ctx.timeout);
  }
  // 日志中间件
  static log(ctx: ctx) {
    if (!ctx.log) return;
    const response = ctx.response || { ok: false, status: 400, statusText: "Bad Request" };
    ctx.data || (ctx.data = { message: ctx.message });
    ctx.body || (ctx.body = {});
    try { typeof ctx.body == "string" && (ctx.body = JSON.parse(ctx.body)); } catch(error) {};
    Object.setPrototypeOf(ctx.data, new function result() {});
    Object.setPrototypeOf(ctx.body, new function params() {});
    Object.setPrototypeOf(ctx, new function context() {});
    console.groupCollapsed(`%c ${dateFormat(String(new Date()))} %c ${ctx.method} %c ${ctx.url} %c ${response.status} ${response.statusText} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${response.ok ? '#67C23A' : '#F56C6C'}; border-radius: 0 3px 3px 0;`,
    );
    console.log(ctx.body);
    console.log(ctx.data);
    console.log(ctx);
    console.groupEnd();
  }

}

// 复制JSON的方法（捕获处理报错，如果报错则返回原样）
function stringify(obj: object) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return obj;
  }
}
function parse(str: string) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
}


// 对外暴露方法创建实例 T 自定义类型配置
export function createAPI<T = any>(ctx?: ctx<T>) {
  const api = new API<T>(ctx);
  const { before, after, error, final, request } = api;
  function fn<params = any, data = any>(url: string, method: string) {
    return (ctx = <ctx<T, params>>{}) => {
      Object.assign(ctx, { url, method });
      return api.request<data>(ctx);
    }
  }
  return {
    before: before.bind(api),
    after: after.bind(api),
    error: error.bind(api),
    final: final.bind(api),
    request: request.bind(api),
    get: <params = any, data = any>(url: string) => fn<params, data>(url, "get"),
    post: <params = any, data = any>(url: string) => fn<params, data>(url, "post"),
    put: <params = any, data = any>(url: string) => fn<params, data>(url, "put"),
    patch: <params = any, data = any>(url: string) => fn<params, data>(url, "patch"),
    del: <params = any, data = any>(url: string) => fn<params, data>(url, "delete"),
  }
}


