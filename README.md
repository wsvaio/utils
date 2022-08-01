# 常用工具函数
[![OSCS Status](https://www.oscs1024.com/platform/badge/wsvaio/utils.svg?size=small)](https://www.oscs1024.com/project/wsvaio/utils?ref=badge_small)

## createAPI
现代浏览器都支持了fetch方法
```typescript
fetch(url).then(data => data.json()).(data => console.log(data));
```
fetch方法本身非常简洁，日常使用中肯定是要进行包装的  

参考了koa express的中间件运行机制，将fetch请求设为核心中间件  
在其之前都为【前置拦截器】，在其之后都为【后置拦截器】  
并且在运行时使用了try catch finall，所以可以配置【错误拦截器】【最终拦截器】



### Example
```typescript

// 从头到尾其实就是ctx这一个对象，所有重要的的属性都在这个对象上，也可以自定义属性，createAPI提供泛型支持

const { DEV, VITE_BASE_API } = import.meta.env;
// 创建api对象 泛型添加自定义属性

export const { post, get, put, patch, del, request,
  error, final, before, after, extendAPI
} = createAPI<{ success?: string | boolean; headers: Record<string, string>; }>({
  baseURL: DEV ? "" : VITE_BASE_API,
  log: DEV, // 控制台是否打印日志
  timeout: 0,
  headers: {

  },
});

// 请求发出前
before(async ctx => Progress.start());
before(async ctx => {
  const auth = authStore();
  ctx.headers["Authorization"] = "Bearer " + auth.token;

});

// 请求发出后
// 复制响应消息
after(async ctx => ctx.message = ctx.data?.msg ?? ctx.message);
// 判断响应状态码
after(async ctx => (ctx.data?.code < 200 || ctx.data?.code > 299) && Promise.reject(ctx));
// 响应内容扁平化
after(async ctx => ctx.data = ctx.data?.data ?? ctx.data);


// 401登录失效
error(async ctx => {
  if (ctx?.data?.code != 401) return;
  // 不notice通知
  ctx.message = "";

  // 删除登录信息；重新登陆
  const auth = authStore();
  auth.logout();

});

// 结束时总会运行
// 进度条结束
final(async ctx => ctx.error ? Progress.done(false) : Progress.done());
// notice 通知 不设置success则不会通知
final(async ctx => ctx.error
  ? ctx.message && ElNotification.error(ctx.message)
  : ctx.success && ElNotification.success(ctx.success == true ? ctx.message : ctx.success));


```
### Config
```typescript
// 总环境类型 custom: 自定义属性 params: body query param 的类型
export type ctx<custom = {}, params = {}> = {
  log?: boolean, // 是否控制台打印日志
  timeout?: number, // 超时中断的时间
  url?: string, // 请求地址
  baseURL?: string, // 根地址
  body?: Partial<params> & { [k: string]: any; } | string, // 请求体
  query?: Partial<params> & { [k: string]: any; }, // 请求search参数
  param?: Partial<params> & { [k: string]: any; }, // 请求参数
  error?: Partial<Error & ctx<custom, params>>, // 错误
  data?: any, // 响应结果
  message?: string, // 响应消息
  status?: number, // 状态码
  response?: Response, // 响应
} & Omit<RequestInit, "body"> & custom; // RequestInit fetch配置 custom 自定义配置
```


### Use
```typescript
// src/api/index.ts
import { post } from "@/api/requets";
// 封装方法
export const testPost1 = post("xxx");
export const testPost2 = post({ url: "xxx", method: "GET", header: {} });



// 使用
testPost1().then(data => console.log(data));

// 柯里化函数，可以接受两层配置，后面的总会覆盖前面的
post<{abc: number}, string>({ url: "xxx/:abc" })({
  body: {}, // 请求体
  param: { abc: 1 }, // param参数 替换:abc
  query: {a: 1, b: 2} // query参数 拼接在路径后面(?a=1&b=2)
}).then(data => console.log(data));
```

```typescript
import { extendAPI } from "@/api/requets";
// 使用extendAPI你可以方便的配置多个可能“雷同”的配置
export const { post, after } = extendAPI();

after(async ctx => {
  console.log("新的拦截器，不会影响requests");
});

post("xxx")().then(data => console.log(data));


```

## merge
在默认配置下几乎等同于Object.assign  
在typescript下obj2会有obj1的属性提示  
```typescript
/**
 * 合并两个对象到obj1
 * deep: 递归深度
 * overwrite: 是否赋值
 * del: 是否删除obj1中obj2不存在的key
 * rtn: 是否返回obj1
 */
export default function merge<T>(obj1: T, obj2 = <Partial<T> & { [k: string]: any }>{}, { deep = 1, overwrite = true, del = false, rtn = true } = {}) {
  deep--;
  if (del) {
    const dels = Object.keys(obj1).filter(item => !Object.keys(obj2).includes(item));
    for (const key of dels) delete obj1[key];
  }
  for (const [key, val] of Object.entries(obj2)) {
    if (!overwrite && (obj1[key] ?? false) !== false) continue;
    if (val instanceof Object && deep > 0) {
      (obj1[key] instanceof Object) || (obj1[key] = {});
      merge(obj1[key], val, { deep, overwrite, del, rtn });
    } else {
      obj1[key] = val;
    }
  }
  return rtn ? "" : obj1;
}

```

...