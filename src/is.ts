import { toRawType } from "./to";

// export const is =
//   (...types: string[]) =>
//   (value: unknown) =>
//     types.includes(toRawType(value));

/**
 * 基本数据类型和一些常用的内置对象
 */
export interface BuiltInObjects {
  String: string;
  Number: number;
  Null: null;
  Undefined: undefined;
  Symbol: Symbol;
  BigInt: BigInt;
  Boolean: boolean;
  Object: Object;
  Function: Function;
  Error: Error;
  Date: Date;
  RegExp: RegExp;
  Map: Map<unknown, unknown>;
  Set: Set<unknown>;
  WeakMap: WeakMap<Object, unknown>;
  WeakSet: WeakSet<Object>;
  ArrayBuffer: ArrayBuffer;
  Promise: Promise<unknown>;
  Array: Array<unknown>;
}
/**
 * 返回一个函数，该函数接受一个值并检查其是否为指定类型之一。
 *
 * @param types 要检查的类型的字符串数组。
 * @returns 一个函数，该函数接受一个值并返回一个布尔值，指示值是否为指定类型之一。
 */
export function is<T extends keyof BuiltInObjects>(...types: T[]) {
  return (value: unknown): value is BuiltInObjects[T] =>
    // @ts-expect-error pass
    types.includes(toRawType(value));
}
