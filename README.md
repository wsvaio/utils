# 常用工具函数



# createAPI

## 说明😮
现代浏览器都支持了fetch方法
```typescript
fetch(url).then(data => data.json()).(data => console.log(data));
```
fetch方法本身非常简洁，日常使用中肯定是要进行包装的  

参考了koa express的中间件运行机制，将fetch请求设为核心中间件  
在其之前都为【前置拦截器】，在其之后都为【后置拦截器】  
并且在运行时使用了try catch finall，所以可以配置【错误拦截器】【最终拦截器】


## 使用🙃

1. 安装
```
npm i wzxty
```

2. 配置

```typescript
// src/api/request.ts
import { createAPI } from "wzxty";
const { DEV, VITE_BASE_API } = import.meta.env;
export const { post, get, before, after, error, final, extendAPI } = createAPI({
  baseURL: DEV ? "" : VITE_BASE_API,
  log: DEV,
  timeout: 0,
  headers: {

  }
});

// 请求发出前
before(async ctx => {
  ctx.headers["token"] = "xxx";
});
before(async ctx => {
  ...
});

// 请求发出后
after(async ctx => {
  if (ctx?.data?.code != 200) return Promise.reject("code != 200");
});

// 错误处理
error(async ctx => {
  if (ctx.error.message == "code != 200") console.log("状态码错误");
});


// 最终拦截器
final(async ctx => {

  ...

});

```

3. 使用

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

## config🙄
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


## Example👀
```typescript

// 从头到尾其实就是ctx这一个对象，所有重要的的属性都在这个对象上，也可以自定义属性，createAPI提供泛型支持
// 下面是我真实开发的一套配置

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

