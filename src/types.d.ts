/**
 * 获取类型T中所有属性的值的联合类型
 */
export type ValueOf<T> = T[keyof T];

/**
 * 将类型T中所有属性都变为可写属性
 */
export type Writeable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * 将类型T中所有属性都变为可选属性
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * 变联合类型函数参数
 */
export type ToUnionOfFunction<T> = T extends any ? (x: T) => any : never;
/**
 * 联合转交叉
 */
export type UnionToIntersection<T> = ToUnionOfFunction<T> extends (x: infer P) => any ? P : never;

/**
 * 判断两个类型是否相等
 */
export type IsEqual<T, U> = (<T1>() => T1 extends T ? 1 : 2) extends <T2>() => T2 extends U ? 1 : 2 ? true : false;

/**
 * 判断属性是否可选
 */
export type IsOptional<O, K extends keyof O> = Partial<Pick<O, K>> extends Pick<O, K> ? true : false;

/**
 * 可JSON化基本类型
 */
export type JsonableBasic = number | boolean | string | null;
/**
 * 可JSON化对象类型
 */
export interface JsonableObj {
  [key: string | number]: JsonableBasic | JsonableObj | JsonableArr;
}
/**
 * 可JSON化数组类型
 */
export type JsonableArr = (JsonableBasic | JsonableObj | JsonableArr)[];
/**
 * 可JSON化类型
 */
export type Jsonable = JsonableBasic | JsonableObj | JsonableArr;
