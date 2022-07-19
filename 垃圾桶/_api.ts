import { merge } from "../utils/objUtils";

type options = { url?: string, baseURL?: string, body?: any, query?: any, param?: any, data?: { [k: string]: any, body?: any, query?: any, param?: any; }; } & Omit<RequestInit, "body">;

type response<T = any> = Response & { options: options, data: T, message: string; };

type before = (options: options) => Promise<any>;
type after = (response: response) => Promise<any>;
type error = (error: Partial<Error & response>) => Promise<any>;




export default class API {
  options: options = {};

  beforeList: before[] = [];
  afterList: after[] = [];
  errorList: error[] = [];


  constructor(options?: options) {
    this.options = options ?? {};

  }


  before(middleware: before) {
    this.beforeList.push(middleware);
  }
  after(middleware: after) {
    this.afterList.push(middleware);
  }
  error(middleware: error) {
    this.errorList.push(middleware);
  }


  async request<R = any>(options: options) {

    const { query = options.query, param = options.param, body = options.body } = options.data ?? {};

    const url = new URL(options.url ?? "", options.baseURL);

    options = merge(merge({}, this.options, Infinity), options, Infinity);
    Object.assign(options, { body: JSON.stringify(options.body) });
    if (query) for (let [k, v] of Object.entries<any>(query)) url.searchParams.append(k, v);
    if (param) for (let [k, v] of Object.entries<any>(param)) url.pathname.replace(`:${k}`, v);
    if (body) {
      options.body = body;
    } else {
      options.body = options.data;
      delete options.body.query;
      delete options.body.param;
    }
    options.url = url.pathname + url.search + url.hash;

    try {
      for (let fn of this.beforeList) await fn(options);

      const response = <response<R>>await fetch(url.href, options);
      let data = await response.text();
      try { data = JSON.parse(data); } catch (error) { };
      Object.assign(response, { options, data, message: `操作${response.ok ? '成功' : '失败'}：${response.status} ${response.statusText}` });

      for (let fn of this.afterList) await fn(response);

      return response.data;

    } catch (error: any) {
      for (let fn of this.errorList) await fn(error);
      return Promise.reject(error);
    }
  }

  get<R = any>(url: string, query = {} as object, options = {} as options) {
    Object.assign(options, { url, query, method: "get" });
    return this.request<R>(options);
  }

  post<R = any, B = any>(url: string, body: B, options = {} as options) {
    Object.assign(options, { url, body, method: "post" });
    return this.request<R>(options);
  }
  post1<R = any>(url: string, body: { [k: string]: any, query?: object, param?: object; }, options = {} as options) {
    const { query, param } = body;
    delete body.query;
    delete body.param;
    Object.assign(options, { url, query, param, body, method: "post" });
    return this.request<R>(options);
  }

  put<R = any, B = any>(url: string, body: B, options = {} as options) {
    Object.assign(options, { url, body, method: "put" });
    return this.request<R>(options);
  }

  patch<R = any, B = any>(url: string, body: B, options = {} as options) {
    Object.assign(options, { url, body, method: "patch" });
    return this.request<R>(options);
  }

  del<R = any>(url: string, options = {} as options) {
    Object.assign(options, { url, method: "delete" });
    return this.request<R>(options);
  }

  static create(options?: options) {
    const api = new API(options);
    const { get, post, put, patch, del, request, before, after, error, beforeList, afterList } = api;
    return {
      options, beforeList, afterList,
      get: get.bind(api),
      post: post.bind(api),
      put: put.bind(api),
      del: del.bind(api),
      request: request.bind(api),
      before: before.bind(api),
      after: after.bind(api),
      patch: patch.bind(api),
      error: error.bind(api),
    };
  }

}