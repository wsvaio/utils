import { progress, createAPI } from "wsvaio";

import { router } from "@/modules/router";


const { DEV, VITE_BASE_API } = import.meta.env;
const url = new URL(import.meta.url);
// 创建api对象 泛型添加自定义属性
export const api = createAPI<{ success: string }>({
  baseURL: DEV ? url.origin : VITE_BASE_API,
  log: DEV, // 控制台是否打印日志
  timeout: 0,
  headers: {

  },

});
export const { post, get, put, patch, del } = api;

// 请求发出前
api.before(ctx => progress.start());
api.before(ctx => {
  const oToken = tokenStore();
  ctx.headers || (ctx.headers = {});
  ctx.headers["Authorization"] = `Bearer ${oToken.token}`;
});

// 请求发出后
api.after(ctx => progress.done());
api.after(ctx => ctx.data.msg && (ctx.message = ctx.data.msg));
api.after(ctx => (ctx.data.code && ctx.data.code <= 299 && ctx.data.code >= 200) || Promise.reject(ctx));
api.after(ctx => ctx.data.data && (ctx.data = ctx.data.data));

// 拦截错误
api.error(ctx => progress.done(false));
api.error(ctx => {
  if (ctx.status != 301) return;
  ctx.message = "登录失效！请重新登录";
  // router.push({ name: "login" });
});


// 结束时总是运行
api.final(ctx => ctx.error && ElNotification.error(ctx.message));
api.final(ctx => !ctx.error && ctx.success != undefined && ElNotification.success(ctx.success || ctx.message));
